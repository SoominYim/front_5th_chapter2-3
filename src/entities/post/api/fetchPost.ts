import Post from "../model/type.ts"
import User from "../../user/model/type.ts"
export interface PostParams {
  limit: number
  skip: number
}

export interface TagParams extends PostParams {
  tag: string
}

/**
 * 게시물 가져오기
 * @param limit 한 번에 가져올 게시물 수
 * @param skip 건너뛸 게시물 수
 * @returns 게시물 목록과 총 게시물 수
 */
export const fetchPosts = async ({ limit, skip }: PostParams) => {
  const postsResponse = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  const postsData = await postsResponse.json()

  const usersResponse = await fetch("/api/users?limit=0&select=username,image")
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
export const fetchPostsByTag = async ({ tag, limit, skip }: TagParams) => {
  if (!tag || tag === "all") {
    return fetchPosts({ limit, skip })
  }

  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`/api/posts/tag/${tag}`),
    fetch("/api/users?limit=0&select=username,image"),
  ])

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
export const searchPosts = async (query: string) => {
  const response = await fetch(`/api/posts/search?q=${query}`)
  const data = await response.json()
  return data
}

/**
 * 태그 가져오기
 * @returns 태그 목록
 */
export const fetchTags = async () => {
  const response = await fetch("/api/posts/tags")
  const data = await response.json()
  return data
}
