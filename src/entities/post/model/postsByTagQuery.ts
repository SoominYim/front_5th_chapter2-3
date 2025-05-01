import { useQuery } from "@tanstack/react-query"
import { fetchPostsByTagAPI, TagParams } from "../api/postApi"

/**
 * 태그별 게시물 목록을 가져오는 쿼리 훅
 * @param params 태그, 페이지네이션, 정렬 매개변수
 */
export function usePostsByTagQuery(params: TagParams) {
  const { tag, limit, skip, sortBy, sortOrder } = params

  return useQuery({
    queryKey: ["posts", "tag", { tag, limit, skip, sortBy, sortOrder }],
    queryFn: () => fetchPostsByTagAPI({ tag, limit, skip, sortBy, sortOrder })
  })
} 