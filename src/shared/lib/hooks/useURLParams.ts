import { useCallback, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"

interface URLParamValues {
  [key: string]: string | number | boolean | undefined | null
}

export function useURLParams() {
  const navigate = useNavigate()
  const location = useLocation()

  const params = useMemo(() => new URLSearchParams(location.search), [location.search])

  // 파라미터 업데이트 함수
  const updateURL = useCallback(
    (newParams: URLParamValues) => {
      const updatedParams = new URLSearchParams()

      // 기존 파라미터 복사
      for (const [key, value] of params.entries()) {
        updatedParams.set(key, value)
      }

      // 새 파라미터 추가/업데이트
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          updatedParams.delete(key)
        } else {
          updatedParams.set(key, String(value))
        }
      })

      navigate(`?${updatedParams.toString()}`, { replace: true })
    },
    [navigate, params],
  )

  // 특정 파라미터 값 가져오기
  const getParam = useCallback(
    <T>(key: string, defaultValue: T): T => {
      const value = params.get(key)
      if (value === null) return defaultValue

      // 타입에 따라 변환
      if (typeof defaultValue === "number") {
        return Number(value) as unknown as T
      }
      if (typeof defaultValue === "boolean") {
        return (value === "true") as unknown as T
      }
      return value as unknown as T
    },
    [params],
  )

  return {
    params,
    updateURL,
    getParam,
  }
}
