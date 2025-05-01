import { useQuery } from "@tanstack/react-query"
import { searchPostsAPI } from "../api/postApi"

/**
 * 게시물 검색 결과를 가져오는 쿼리 훅
 * @param query 검색어
 * @param options 정렬 옵션
 */
export function useSearchPostsQuery(
  query: string, 
  options?: { sortBy?: string; sortOrder?: string }
) {
  return useQuery({
    queryKey: ["posts", "search", query, options],
    queryFn: () => searchPostsAPI(query, options),
    enabled: query.length > 0 // 검색어가 있을 때만 요청
  })
} 