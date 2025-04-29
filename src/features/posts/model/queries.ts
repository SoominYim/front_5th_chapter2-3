import { useQuery } from "@tanstack/react-query"
import {
  fetchPosts,
  fetchPostsByTag,
  searchPosts,
  fetchTags,
  PostParams,
  TagParams,
} from "../../../entities/post/api/fetchPost"

export interface PostsQueryParams extends PostParams {
  tag?: string
  searchQuery?: string
  sortBy?: string
  sortOrder?: string
}

// 게시물 쿼리 훅
export function usePostsQuery(params: PostsQueryParams) {
  const { tag, limit, skip, searchQuery, sortBy, sortOrder } = params

  return useQuery({
    queryKey: ["posts", { tag, limit, skip, searchQuery, sortBy, sortOrder }],
    queryFn: () => {
      if (searchQuery) {
        return searchPosts(searchQuery, { sortBy, sortOrder })
      }
      return tag ? fetchPostsByTag({ tag, limit, skip, sortBy, sortOrder } as TagParams) : fetchPosts({ limit, skip, sortBy, sortOrder })
    },
  })
}

// 태그 쿼리 훅
export function useTagsQuery() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  })
}
