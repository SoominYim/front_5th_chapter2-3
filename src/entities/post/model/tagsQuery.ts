import { useQuery } from "@tanstack/react-query"
import { fetchTagsAPI } from "../api/postApi"

/**
 * 태그 목록을 가져오는 쿼리 훅
 */
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