import { useQuery } from "@tanstack/react-query"
import { fetchUserAPI } from "../api/userApi"

/**
 * 특정 사용자 정보를 가져오는 쿼리 훅
 * @param userId 사용자 ID
 * @param options 추가 옵션
 */
export function useUserQuery(userId: number, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserAPI(userId),
    enabled: options.enabled !== false && userId > 0,
  })
} 