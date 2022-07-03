import {
  createPostSchema,
  getSinglePostSchema,
} from "../../schema/post.schema";
import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";

export const postRouter = createRouter()
  .mutation("create-post", {
    input: createPostSchema,
    resolve: async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "User needs to logged in",
        });
      }
      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });

      return post;
    },
  })
  .query("post", {
    resolve: async ({ ctx }) => {
      return ctx.prisma.post.findMany({
        include: { user: true },
      });
    },
  })
  .query("single-post", {
    input: getSinglePostSchema,
    resolve: async ({ input, ctx }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          user: true,
        },
      });
    },
  });
