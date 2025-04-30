import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분 동안 데이터는 신선한 상태 유지
            refetchOnWindowFocus: false, // 윈도우 포커스시 자동 재요청 비활성화
            retry: 1, // 실패시 재시도 횟수 제한
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
