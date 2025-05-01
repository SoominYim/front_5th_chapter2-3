import { useQuery } from "@tanstack/react-query"
import { 
  fetchPostsWithParamsAPI, 
  fetchPostsByTagAPI, 
  searchPostsAPI, 
  fetchTagsAPI, 
  PostParams, 
  TagParams 
} from "../api/postApi"

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
        return searchPostsAPI(searchQuery, { sortBy, sortOrder })
      }
      return tag
        ? fetchPostsByTagAPI({ tag, limit, skip, sortBy, sortOrder } as TagParams)
        : fetchPostsWithParamsAPI({ limit, skip, sortBy, sortOrder })
    },
  })
}

// 태그 쿼리 훅
export function useTagsQuery() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsAPI,
    // 태그 데이터는 자주 변경되지 않으므로 캐싱 시간 증가
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간 (이전 cacheTime)
    // 많은 태그가 있을 수 있으므로 미리 가져오기
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
