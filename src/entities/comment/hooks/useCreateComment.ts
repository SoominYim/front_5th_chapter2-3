import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { createCommentAPI } from "../api/commentApi"

/**
 * 댓글 추가를 위한 커스텀 훅
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const { newComment, comments, setComments, setShowAddCommentDialog, setNewComment } = useCommentStore(
    useShallow((state) => ({
      newComment: state.newComment,
      comments: state.comments,
      setComments: state.setComments,
      setShowAddCommentDialog: state.setShowAddCommentDialog,
      setNewComment: state.setNewComment,
    }))
  )

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: createCommentAPI,
    onSuccess: (data) => {
      // 기존 상태 업데이트 방식 유지
      setComments(data.postId, [...(comments[data.postId] || []), data])
      
      // 추가적으로 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      
      // UI 상태 초기화
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1, user: { username: "", id: 1 }, likes: 0 })
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    }
  })

  // 액션 함수 - 간단하게 mutation 호출
  const addComment = () => {
    mutation.mutate(newComment)
  }

  return { 
    addComment,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
} 