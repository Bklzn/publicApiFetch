import { useQuery } from "@tanstack/react-query"
import { fetchPosts } from "@/lib/api"

export const postKeys = {
  all: ["posts"] as const,
}

export function usePosts() {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: fetchPosts,
  })
}
