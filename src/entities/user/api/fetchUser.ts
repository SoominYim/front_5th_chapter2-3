import useUserStore from "../../../features/user/model/useUserStore"
import { User } from "../model/type"

// 사용자 모달 열기
export const fetchUser = async (user: User) => {
  const { setSelectedUser, setShowUserModal } = useUserStore.getState()
  try {
    const response = await fetch(`/api/users/${user.id}`)
    const userData = await response.json()
    setSelectedUser(userData)
    setShowUserModal(true)
  } catch (error) {
    console.error("사용자 정보 가져오기 오류:", error)
  }
}
