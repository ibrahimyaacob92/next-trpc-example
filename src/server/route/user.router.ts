import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  createUserOutputSchema,
  createUserSchema,
} from "../../schema/user.schema";
import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";

export const userRouter = createRouter().mutation("register-user", {
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
});
