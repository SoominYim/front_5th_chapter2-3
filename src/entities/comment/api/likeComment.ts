import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"

// API 요청 함수 분리 - postId는 API 호출에 사용되지 않지만 mutation에서는 필요합니다
export const likeCommentAPI = async ({ id, likes }: { id: number; likes: number }) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: likes + 1 }),
  })
  
  if (!response.ok) {
    throw new Error("댓글 좋아요 실패")
  }
  
  return response.json()
}

// 댓글 좋아요를 위한 커스텀 훅
export const useLikeComment = () => {
  const queryClient = useQueryClient()
  const { comments, setComments } = useCommentStore(
    useShallow((state) => ({
      comments: state.comments,
      setComments: state.setComments,
    }))
  )

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: ({ id, likes }: { id: number; likes: number }) => likeCommentAPI({ id, likes }),
    onSuccess: (data, variables) => {
      
      // variables에는 mutate 호출 시 전달한 모든 매개변수가 포함
      const { postId } = variables as { id: number; likes: number; postId: number }
      
      // 기존 상태 업데이트 방식 유지
      setComments(
        postId,
        comments[postId]?.map((comment) =>
          comment.id === data.id ? { ...data, likes: (comment.likes || 0) + 1 } : comment,
        ) || []
      )
      
      // 추가적으로 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    }
  })

  // 액션 함수 - 간단하게 mutation 호출
  const likeComment = (id: number, postId: number) => {
    const comment = comments[postId]?.find((c) => c.id === id)
    if (!comment) return
    
    const likes = comment.likes || 0
    // postId는 API에는 필요없지만 onSuccess에서 사용하기 위해 전달
    mutation.mutate({ id, likes, postId } as any)
  }

  return { 
    likeComment,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
}
