import z from "zod";

export const createPostSchema = z.object({
  title: z.string().max(256, "Max title link is 256 characters"),
  body: z.string().min(10),
});

export const getSinglePostSchema = z.object({
  postId: z.string().uuid(),
});

export type CreatePostInput = z.TypeOf<typeof createPostSchema>;
