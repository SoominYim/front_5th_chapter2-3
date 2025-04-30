import { User } from "../model/type"

// 사용자 정보 가져오기
export const fetchUser = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${userId}`)
    return await response.json()
  } catch (error) {
    console.error("사용자 정보 가져오기 오류:", error)
    throw error
  }
}
