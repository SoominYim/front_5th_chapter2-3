import { useQuery } from "@tanstack/react-query"
import usePostsStore from "../../../features/posts/model/usePostsStore"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"
import { 
  fetchPostsAPI, 
  fetchPostsWithParamsAPI, 
  fetchPostsByTagAPI, 
  searchPostsAPI, 
  fetchTagsAPI,
  PostParams,
  TagParams
} from "../api/postApi"

/**
 * 게시물 목록을 가져오는 기본 커스텀 훅
 * @param enabled 요청 활성화 여부 (기본값: true)
 */
export const useFetchPosts = (enabled: boolean = true) => {
  const { posts, setPosts } = usePostsStore(
    useShallow((state) => ({
      posts: state.posts,
      setPosts: state.setPosts,
    }))
  )

  // TanStack Query의 useQuery 사용
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPostsAPI,
    enabled: enabled && posts.length === 0, // 활성화 상태이고, 이미 불러온 게시물이 없는 경우에만 요청
  })

  // 데이터가 로드되면 useEffect를 사용하여 상태 업데이트
  useEffect(() => {
    if (query.data && posts.length === 0) {
      setPosts(query.data.posts)
    }
  }, [query.data, posts.length, setPosts])

  // 에러 처리
  useEffect(() => {
    if (query.error) {
      console.error("게시물 목록 가져오기 오류:", query.error)
    }
  }, [query.error])

  return {
    posts,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  }
}

/**
 * 페이지네이션, 정렬이 있는 게시물 목록을 가져오는 커스텀 훅
 */
export const useFetchPostsWithParams = (params: PostParams) => {
  // TanStack Query의 useQuery 사용
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPostsWithParamsAPI(params)
  })
}

/**
 * 태그별 게시물 목록을 가져오는 커스텀 훅
 */
export const useFetchPostsByTag = (params: TagParams) => {
  // TanStack Query의 useQuery 사용
  return useQuery({
    queryKey: ["posts", "tag", params],
    queryFn: () => fetchPostsByTagAPI(params)
  })
}

/**
 * 게시물 검색 결과를 가져오는 커스텀 훅
 */
export const useSearchPosts = (query: string, options?: { sortBy?: string; sortOrder?: string }) => {
  // TanStack Query의 useQuery 사용
  return useQuery({
    queryKey: ["posts", "search", query, options],
    queryFn: () => searchPostsAPI(query, options),
    enabled: query.length > 0 // 검색어가 있을 때만 요청
  })
}

/**
 * 태그 목록을 가져오는 커스텀 훅
 */
export const useFetchTags = () => {
  // TanStack Query의 useQuery 사용
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsAPI
  })
}
