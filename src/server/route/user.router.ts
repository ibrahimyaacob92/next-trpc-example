import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  createUserOutputSchema,
  createUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from "../../schema/user.schema";
import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";
import { sendLoginEmail } from "../../utils/mailer";
import { baseUrl, url } from "../../constants";
import { encode, decode } from "../../utils/base64";
import { signJwt } from "../../utils/jwt";
import { serialize } from "cookie";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    resolve: async ({ ctx, input }) => {
      const { email, name } = input;
      console.log({ input });

      try {
        const user = await ctx.prisma.user.create({
          data: { email, name },
        });

        return user;
      } catch (error) {
        console.log("error found", { error });
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User Already exists",
            });
          }
        }

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })

  .mutation("request-otp", {
    input: requestOtpSchema,
    resolve: async ({ input, ctx }) => {
      const { email, redirect } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: baseUrl,
        email: user.email,
      });
    },
  })

  .query("get-users", {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.user.findMany();
    },
  })

  .query("verify-otp", {
    input: verifyOtpSchema,
    resolve: async ({ input, ctx }) => {
      const decoded = decode(input.hash).split(":");

      const [id, email] = decoded;

      const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      });

      if (!token) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Invalid Token",
        });
      }

      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      ctx.res.setHeader("Set-Cookie", serialize("token", jwt, { path: "/" }));

      return {
        redirect: token.redirect,
      };
    },
  });
