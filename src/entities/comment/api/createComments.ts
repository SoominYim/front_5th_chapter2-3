import useCommentStore from "../../../features/comment/model/useCommentStore"

// 댓글 추가
export const useCreateComment = () => {
  const { newComment, comments, setComments, setShowAddCommentDialog, setNewComment } = useCommentStore.getState()

  const addComment = async () => {
    try {
      // postId가 null이면 중단
      if (newComment.postId === null) {
        console.error("댓글 추가 오류: 게시물 ID가 필요합니다.")
        return
      }

      // 디버깅: 요청 데이터 로깅
      console.log("댓글 추가 요청 데이터:", JSON.stringify(newComment, null, 2))

      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
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

      const data = await response.json()
      setComments(data.postId, [...(comments[data.postId] || []), data])
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1, user: { username: "", id: 1 }, likes: 0 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }
  return { addComment }
}
