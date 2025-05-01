import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { updateCommentAPI } from "../api/commentApi"

/**
 * 댓글 업데이트를 위한 커스텀 훅
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  const { comments, selectedComment, setComments, setShowEditCommentDialog } = useCommentStore(
    useShallow((state) => ({
      comments: state.comments,
      selectedComment: state.selectedComment,
      setComments: state.setComments,
      setShowEditCommentDialog: state.setShowEditCommentDialog,
    }))
  )

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: updateCommentAPI,
    onSuccess: (data) => {
      // 기존 상태 업데이트 방식 유지
      setComments(
        data.postId,
        comments[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      )
      
      // 추가적으로 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      
      // UI 상태 초기화
      setShowEditCommentDialog(false)
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
    }
  })

  // 액션 함수 - 간단하게 mutation 호출
  const updateComment = () => {
    if (!selectedComment?.id || !selectedComment?.postId) {
      console.error("댓글 업데이트 오류: 댓글 ID와 게시물 ID가 필요합니다.")
      return
    }
    
    mutation.mutate({ id: selectedComment.id, body: selectedComment.body })
  }

  return { 
    updateComment,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
} 