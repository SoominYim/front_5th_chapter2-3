import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { deleteCommentAPI } from "../api/commentApi"

/**
 * 댓글 삭제를 위한  훅
 */
export const useDeleteComment = (): {
  deleteComment: (id: number, postId: number) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} => {
  const queryClient = useQueryClient()
  const { comments, setComments } = useCommentStore(
    useShallow((state) => ({
      comments: state.comments,
      setComments: state.setComments,
    }))
  )

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    // API 요청 시 id만 사용하고 나머지 데이터는 무시
    mutationFn: ({ id }: { id: number; postId: number }) => deleteCommentAPI(id),
    onSuccess: (_, variables) => {
      const { id, postId } = variables

      // 기존 상태 업데이트 방식 유지
      setComments(
        postId,
        comments[postId].filter((comment) => comment.id !== id),
      )
      
      // 추가적으로 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    }
  })

  const deleteComment = (id: number, postId: number) => {
    // id와 postId 모두 전달하고 mutationFn에서 필요한 값만 사용
    mutation.mutate({ id, postId })
  }

  return { 
    deleteComment,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
} 