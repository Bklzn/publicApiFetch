import { Post, PostsResponseSchema } from "@/schemas/post";

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  const data = await res.json();
  return PostsResponseSchema.parse(data);
}
