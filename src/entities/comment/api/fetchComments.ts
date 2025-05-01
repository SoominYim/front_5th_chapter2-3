import { useQuery } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"

// API 요청 함수 분리
export const fetchCommentsAPI = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`)
  
  if (!response.ok) {
    throw new Error("댓글 가져오기 실패")
  }
  
  return response.json()
}

// 기존 함수 복원 (하위 호환성 유지)
export const fetchComments = async (postId: number) => {
  const { comments, setComments } = useCommentStore.getState()
  if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
  try {
    const response = await fetch(`/api/comments/post/${postId}`)
    const data = await response.json()
    setComments(postId, data.comments)
  } catch (error) {
    console.error("댓글 가져오기 오류:", error)
  }
}

// 댓글 가져오기 훅으로 변경
export const useFetchComments = (postId: number, enabled: boolean = true) => {
  const { comments, setComments } = useCommentStore(
    useShallow((state) => ({
      comments: state.comments,
      setComments: state.setComments,
    }))
  )

  // TanStack Query의 useQuery 사용
  const query = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsAPI(postId),
    enabled: enabled && !comments[postId] && postId > 0, // 활성화 상태이고, 이미 불러온 댓글이 없고, 유효한 postId인 경우에만 요청
  })

  // 데이터가 로드되면 useEffect를 사용하여 상태 업데이트
  useEffect(() => {
    if (query.data && !comments[postId]) {
      setComments(postId, query.data.comments)
    }
  }, [query.data, comments, postId, setComments])

  // 에러 처리
  useEffect(() => {
    if (query.error) {
      console.error("댓글 가져오기 오류:", query.error)
    }
  }, [query.error])

  return {
    comments: comments[postId] || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  }
}
