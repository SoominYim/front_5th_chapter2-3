import { useQuery } from "@tanstack/react-query"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"
import { fetchCommentsAPI } from "../api/commentApi"

/**
 * 게시물별 댓글 목록을 가져오는 커스텀 훅
 * @param postId 게시물 ID
 * @param enabled 요청 활성화 여부 (기본값: true)
 */
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