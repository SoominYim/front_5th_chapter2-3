import { useMutation } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"

// API 요청 함수 분리
export const createCommentAPI = async (commentData: any) => {
  // postId가 null이면 중단
  if (commentData.postId === null) {
    throw new Error("댓글 추가 오류: 게시물 ID가 필요합니다.")
  }

  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  })

  // 오류 응답 처리
  if (!response.ok) {
    const errorText = await response.text()
    console.error("댓글 추가 오류 응답:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    })
    throw new Error(`서버 오류: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// 댓글 추가
export const useCreateComment = () => {
  const { newComment, comments, setComments, setShowAddCommentDialog, setNewComment } = useCommentStore()

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: createCommentAPI,
    onSuccess: (data) => {
      // 기존 상태 업데이트 방식 유지
      setComments(data.postId, [...(comments[data.postId] || []), data])
      
      // UI 상태 초기화
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1, user: { username: "", id: 1 }, likes: 0 })
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    }
  })

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
