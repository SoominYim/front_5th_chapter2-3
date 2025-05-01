import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"

// API 요청 함수 분리 - postId는 API 호출에 사용되지 않지만 mutation에서는 필요합니다
export const deleteCommentAPI = async ({ id }: { id: number }) => {
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
  const queryClient = useQueryClient()
  const { comments, setComments } = useCommentStore(
    useShallow((state) => ({
      comments: state.comments,
      setComments: state.setComments,
    }))
  )

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteCommentAPI({ id }),
    onSuccess: (_, variables) => {
      
      // variables에는 mutate 호출 시 전달한 모든 매개변수가 포함
      const { id, postId } = variables as { id: number; postId: number }
      
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
    // id만 API에 전달하고 postId는 onSuccess에서 사용하기 위해 함께 전달
    mutation.mutate({ id, postId } as any)
  }

  return { 
    deleteComment,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
}
