import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { likeCommentAPI } from "../api/commentApi"

/**
 * 댓글 좋아요를 위한 훅
 */
export const useLikeComment = (): {
  likeComment: (id: number, postId: number) => void;
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
    // API 요청 시 id와 likes만 사용하고 나머지 데이터는 무시
    mutationFn: ({ id, likes }: { id: number; likes: number; postId: number }) => 
      likeCommentAPI({ id, likes }),
    onSuccess: (data, variables) => {
      const { postId } = variables
      
      // 기존 댓글 찾기
      const originalComment = comments[postId]?.find(c => c.id === data.id)
      
      if (originalComment) {
        // 기존 상태 업데이트 방식 유지
        setComments(
          postId,
          comments[postId]?.map((comment) =>
            comment.id === data.id ? { 
              ...comment,  // 기존 댓글 데이터 유지
              likes: (comment.likes || 0) + 1,  // 좋아요 수만 업데이트
              isLiked: data.isLiked
            } : comment,
          ) || []
        )
      }
      
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

    // id, likes, postId 모두 전달하고 mutationFn에서 필요한 값만 사용
    mutation.mutate({ id, likes, postId })
  }

  return { 
    likeComment,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
} 