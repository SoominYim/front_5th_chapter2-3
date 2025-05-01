import { User } from "../model/type"

// 사용자 정보 가져오기
export const fetchUserAPI = async (userId: number): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`)

  if (!response.ok) {
    throw new Error("사용자 정보 가져오기 실패")
  }

  return await response.json()
}


