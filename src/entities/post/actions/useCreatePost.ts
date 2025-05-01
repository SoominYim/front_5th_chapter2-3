import { useMutation, useQueryClient } from "@tanstack/react-query"
import usePostsStore from "../../../features/posts/model/usePostsStore"
import { createPostAPI } from "../api/postApi"

/**
 * 게시물 추가를 위한 커스텀 훅
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const { newPost, posts, setNewPost, setPosts, setShowAddDialog } = usePostsStore()

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: createPostAPI,
    onSuccess: (data) => {
      // 기존 상태 업데이트 방식 유지
      setPosts([data, ...posts])
      
      // 추가적으로 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      
      // UI 상태 초기화
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    },
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    }
  })

  // 액션 함수 - 간단하게 mutation 호출
  const addPost = () => {
    mutation.mutate(newPost)
  }
  
  return { 
    addPost,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
} 