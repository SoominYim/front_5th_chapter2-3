// 게시물 관련 API 요청 함수들
import Post from "../model/type.ts"
import { User } from "../../user/model/type.ts"

export interface PostParams {
  limit: number
  skip: number
  sortBy?: string
  sortOrder?: string
}

export interface TagParams extends PostParams {
  tag: string
}

/**
 * 게시물 목록 가져오기 (기본)
 */
export const fetchPostsAPI = async () => {
  const response = await fetch("/api/posts")
  
  if (!response.ok) {
    throw new Error("게시물 목록 가져오기 실패")
  }
  
  return response.json()
}

/**
 * 게시물 가져오기 (페이지네이션, 정렬)
 * @param limit 한 번에 가져올 게시물 수
 * @param skip 건너뛸 게시물 수
 * @returns 게시물 목록과 총 게시물 수
 */
export const fetchPostsWithParamsAPI = async ({ limit, skip, sortBy, sortOrder }: PostParams) => {
  let url = `/api/posts?limit=${limit}&skip=${skip}`

  if (sortBy && sortBy !== "none") {
    url += `&sortBy=${sortBy}&order=${sortOrder || "asc"}`
  }

  const postsResponse = await fetch(url)
  
  if (!postsResponse.ok) {
    throw new Error("게시물 목록 가져오기 실패")
  }
  
  const postsData = await postsResponse.json()

  const usersResponse = await fetch("/api/users?limit=0&select=username,image")
  
  if (!usersResponse.ok) {
    throw new Error("사용자 목록 가져오기 실패")
  }
  
  const usersData = await usersResponse.json()

  const postsWithUsers = postsData.posts.map((post: Post) => ({
    ...post,
    author: usersData.users.find((user: User) => user.id === post.userId),
  }))

  return {
    posts: postsWithUsers,
    total: postsData.total,
  }
}

/**
 * 태그별 게시물 가져오기
 * @param tag 태그 이름
 * @param limit 한 번에 가져올 게시물 수
 * @param skip 건너뛸 게시물 수
 * @returns 게시물 목록과 총 게시물 수
 */
export const fetchPostsByTagAPI = async ({ tag, limit, skip, sortBy, sortOrder }: TagParams) => {
  if (!tag || tag === "all") {
    return fetchPostsWithParamsAPI({ limit, skip, sortBy, sortOrder })
  }

  let url = `/api/posts/tag/${tag}`
  const queryParams = new URLSearchParams()

  if (limit) queryParams.append("limit", limit.toString())
  if (skip) queryParams.append("skip", skip.toString())
  if (sortBy && sortBy !== "none") {
    queryParams.append("sortBy", sortBy)
    queryParams.append("order", sortOrder || "asc")
  }

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`
  }

  const [postsResponse, usersResponse] = await Promise.all([
    fetch(url),
    fetch("/api/users?limit=0&select=username,image"),
  ])

  if (!postsResponse.ok) {
    throw new Error("태그별 게시물 가져오기 실패")
  }
  
  if (!usersResponse.ok) {
    throw new Error("사용자 목록 가져오기 실패")
  }

  const postsData = await postsResponse.json()
  const usersData = await usersResponse.json()

  const postsWithUsers = postsData.posts.map((post: Post) => ({
    ...post,
    author: usersData.users.find((user: User) => user.id === post.userId),
  }))

  return {
    posts: postsWithUsers,
    total: postsData.total,
  }
}

/**
 * 게시물 검색
 * @param query 검색 쿼리
 * @returns 게시물 목록과 총 게시물 수
 */
export const searchPostsAPI = async (query: string, options?: { sortBy?: string; sortOrder?: string }) => {
  let url = `/api/posts/search?q=${query}`

  if (options?.sortBy && options.sortBy !== "none") {
    url += `&sortBy=${options.sortBy}&order=${options.sortOrder || "asc"}`
  }

  const [postsResponse, usersResponse] = await Promise.all([
    fetch(url),
    fetch("/api/users?limit=0&select=username,image")
  ])
  
  if (!postsResponse.ok) {
    throw new Error("게시물 검색 실패")
  }
  
  if (!usersResponse.ok) {
    throw new Error("사용자 목록 가져오기 실패")
  }
  
  const postsData = await postsResponse.json()
  const usersData = await usersResponse.json()
  
  // 검색 결과 게시물에 사용자 정보 추가
  const postsWithUsers = postsData.posts.map((post: any) => ({
    ...post,
    author: usersData.users.find((user: any) => user.id === post.userId),
  }))
  
  return {
    posts: postsWithUsers,
    total: postsData.total,
  }
}

/**
 * 태그 가져오기
 * @returns 태그 목록
 */
export const fetchTagsAPI = async () => {
  const response = await fetch("/api/posts/tags")
  
  if (!response.ok) {
    throw new Error("태그 목록 가져오기 실패")
  }
  
  return response.json()
}

/**
 * 게시물 추가
 */
export const createPostAPI = async (postData: any) => {
  try {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
    
    if (response.ok) {
      return response.json()
    }
    
    throw new Error("게시물 추가 실패")
  } catch (error) {
    console.error("게시물 추가 오류:", error)
    // 오류가 발생해도 UI에서는 추가된 것처럼 처리
    // 임의의 높은 ID를 생성하여 새 게시물처럼 보이게 함
    const randomId = Math.floor(Math.random() * 900) + 100 // 100에서 999 사이의 랜덤 ID
    return { 
      ...postData, 
      id: randomId,
      isCreated: true, 
      // 누락된 필드 추가
      tags: postData.tags || [],
      reactions: { likes: 0, dislikes: 0 }
    }
  }
}

/**
 * 게시물 업데이트
 */
export const updatePostAPI = async (postData: any) => {
  try {
    const response = await fetch(`/api/posts/${postData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
    
    // 사용자 정보 가져오기
    const usersResponse = await fetch("/api/users?limit=0&select=username,image")
    
    if (!usersResponse.ok) {
      throw new Error("사용자 목록 가져오기 실패")
    }
    
    const usersData = await usersResponse.json()
    
    if (response.ok) {
      const updatedPostData = await response.json()
      // 업데이트된 게시물에 사용자 정보 추가
      return {
        ...updatedPostData,
        author: usersData.users.find((user: User) => user.id === updatedPostData.userId)
      }
    }
    
    // 404 오류가 발생하면 업데이트된 것처럼 응답 생성
    if (response.status === 404) {
      console.log(`게시물 ID ${postData.id}는 서버에 없지만, UI에서는 업데이트된 것으로 처리합니다.`)
      return { 
        ...postData, 
        isUpdated: true,
        // 기존 author 정보 유지 또는 없으면 새로 찾기
        author: postData.author || usersData.users.find((user: User) => user.id === postData.userId)
      }
    }
    
    throw new Error("게시물 업데이트 실패")
  } catch (error) {
    console.error("게시물 업데이트 오류:", error)
    // 오류가 발생해도 UI에서는 업데이트된 것처럼 처리
    return { ...postData, isUpdated: true }
  }
}

/**
 * 게시물 삭제
 */
export const deletePostAPI = async (id: number) => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })
    
    if (response.ok) {
      return response.json()
    }
    
    // 404 오류가 발생하면 삭제된 것처럼 응답 생성
    if (response.status === 404) {
      console.log(`게시물 ID ${id}는 서버에 없지만, UI에서는 삭제된 것으로 처리합니다.`)
      return { id, isDeleted: true }
    }
    
    throw new Error("게시물 삭제 실패")
  } catch (error) {
    console.error("게시물 삭제 오류:", error)
    // 오류가 발생해도 UI에서는 삭제된 것처럼 처리
    return { id, isDeleted: true }
  }
} 