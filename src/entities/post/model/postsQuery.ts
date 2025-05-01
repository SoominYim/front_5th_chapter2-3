import { useQuery } from "@tanstack/react-query"
import { fetchPostsWithParamsAPI, fetchPostsByTagAPI, searchPostsAPI, PostParams, TagParams } from "../api/postApi"

export interface PostsQueryParams extends PostParams {
  sortBy?: string
  sortOrder?: string
  tag?: string
  searchQuery?: string
}

/**
 * 게시물 목록을 가져오는 쿼리 훅
 * @param params 페이지네이션, 정렬 매개변수
 */
export function usePostsQuery(params: PostsQueryParams) {
  const { limit, skip, sortBy, sortOrder, tag, searchQuery } = params

  return useQuery({
    queryKey: ["posts", { limit, skip, sortBy, sortOrder, tag, searchQuery }],
    queryFn: () => {
      if (searchQuery) {
        return searchPostsAPI(searchQuery, { sortBy, sortOrder })
      }
      
      return tag 
        ? fetchPostsByTagAPI({ tag, limit, skip, sortBy, sortOrder } as TagParams) 
        : fetchPostsWithParamsAPI({ limit, skip, sortBy, sortOrder })
    }
  })
} 