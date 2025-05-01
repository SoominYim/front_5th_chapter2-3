import { useMutation, useQueryClient } from "@tanstack/react-query"
import usePostsStore from "../../../features/posts/model/usePostsStore"
import { useShallow } from "zustand/shallow"
import { deletePostAPI } from "../api/postApi"

/**
 * 게시물 삭제를 위한 커스텀 훅
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const { posts, setPosts } = usePostsStore(
    useShallow((state) => ({
      posts: state.posts,
      setPosts: state.setPosts,
    })),
  )

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: deletePostAPI,
    onSuccess: (_, variables) => {
      const id = variables
      
      // 기존 상태 업데이트 방식 유지
      setPosts(posts.filter((post) => post.id !== id))
      
      // 추가적으로 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error) => {
      console.error("게시물 삭제 오류:", error)
    }
  })

  const deletePost = (id: number) => {
    mutation.mutate(id)
  }

  return { 
    deletePost,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
} 