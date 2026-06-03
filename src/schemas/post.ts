import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

export const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const PostsResponseSchema = z.array(PostSchema);
export type Post = z.infer<typeof PostSchema>;
