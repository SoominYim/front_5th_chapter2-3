import { useState, useEffect } from "react"
import { useUserQuery } from "../../../entities/user/model"
import useUserStore from "../model/useUserStore"

/**
 * 사용자 모달 관련 액션을 제공하는 훅
 */
export function useUserModalActions() {
  const [userId, setUserId] = useState<number | null>(null)
  const { setSelectedUser, setShowUserModal } = useUserStore()
  
  // TanStack Query 사용
  const { data: userData, isLoading, isError } = useUserQuery(userId || 0, { 
    enabled: userId !== null && userId > 0 
  })
  
  // 데이터가 로드되면 useEffect에서 모달 열기
  useEffect(() => {
    if (userData && userId) {
      setSelectedUser(userData)
      setShowUserModal(true)
      setUserId(null) // 리셋
    }
  }, [userData, userId, setSelectedUser, setShowUserModal])
  
  // 사용자 모달 열기 함수
  const openUserModal = (user: { id: number }) => {
    setUserId(user.id)
  }
  
  return {
    openUserModal,
    isLoading,
    isError
  }
} 