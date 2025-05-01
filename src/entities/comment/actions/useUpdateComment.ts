import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { updateCommentAPI } from "../api/commentApi"

/**
 * 댓글 업데이트를 위한 훅
 */
export const useUpdateComment = (): {
  updateComment: () => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} => {
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
      if (data.postId && comments[data.postId]) {
        setComments(
          data.postId,
          comments[data.postId].map((comment) => 
            comment.id === data.id ? {
              ...comment,      // 기존 댓글 구조 유지
              body: data.body, // 수정된 내용으로 업데이트
              isUpdated: data.isUpdated
            } : comment
          ),
        )
        
        // 추가적으로 쿼리 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      }
      
      // UI 상태 초기화
      setShowEditCommentDialog(false)
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
      // 오류가 발생해도 모달은 닫기
      setShowEditCommentDialog(false)
    }
  })

  // 액션 함수 - 간단하게 mutation 호출
  const updateComment = () => {
    if (!selectedComment) {
      console.error("댓글 업데이트 오류: 선택된 댓글이 없습니다.")
      return
    }
    
    // ID와 postId가 없어도 진행 (클라이언트 생성 댓글 처리)
    if (!selectedComment.id || !selectedComment.postId) {
      console.warn("댓글 업데이트: 클라이언트에서 생성된 댓글을 수정합니다.")
    }
    
    // 필수 정보 세팅
    const id = selectedComment.id || 0
    const postId = selectedComment.postId || 0
    const body = selectedComment.body || ""
    
    mutation.mutate({ 
      id, 
      body,
      postId // API 함수에서 사용할 수 있도록 추가
    })
  }

  return { 
    updateComment,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
} 