import { fetchUser } from "../../../entities/user/api/fetchUser"
import useUserStore from "../model/useUserStore"

// 사용자 모달 열기
export const openUserModal = async (user: { id: number }) => {
  try {
    const { setSelectedUser, setShowUserModal } = useUserStore.getState()
    const userData = await fetchUser(user.id)
    setSelectedUser(userData)
    setShowUserModal(true)
  } catch (error) {
    console.error("사용자 모달 열기 오류:", error)
  }
}
