import { useMutation } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"

// API 요청 함수 분리
export const deleteCommentAPI = async ({ id, postId }: { id: number; postId: number }) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
  
  if (!response.ok) {
    throw new Error("댓글 삭제 실패")
  }
  
  return response.json()
}

// 댓글 삭제 훅으로 변경
export const useDeleteComment = () => {
  const { comments, setComments } = useCommentStore(
    useShallow((state) => ({
      comments: state.comments,
      setComments: state.setComments,
    }))
  )

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: deleteCommentAPI,
    onSuccess: (_, variables) => {
      const { id, postId } = variables
      // 기존 상태 업데이트 방식 유지
      setComments(
        postId,
        comments[postId].filter((comment) => comment.id !== id),
      )
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    }
  })

  const deleteComment = (id: number, postId: number) => {
    mutation.mutate({ id, postId })
  }

  return { 
    deleteComment,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
}
