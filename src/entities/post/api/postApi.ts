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

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error("게시물 검색 실패")
  }
  
  return response.json()
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
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  
  if (!response.ok) {
    throw new Error("게시물 추가 실패")
  }
  
  return response.json()
}

/**
 * 게시물 업데이트
 */
export const updatePostAPI = async (postData: any) => {
  const response = await fetch(`/api/posts/${postData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  
  if (!response.ok) {
    throw new Error("게시물 업데이트 실패")
  }
  
  return response.json()
}

/**
 * 게시물 삭제
 */
export const deletePostAPI = async (id: number) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
  
  if (!response.ok) {
    throw new Error("게시물 삭제 실패")
  }
  
  return response.json()
} 