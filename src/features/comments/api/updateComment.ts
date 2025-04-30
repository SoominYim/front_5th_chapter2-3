import useCommentStore from "../model/useCommentStore"

// 댓글 업데이트
export const updateComment = async () => {
  const { comments, selectedComment, setComments, setShowEditCommentDialog } = useCommentStore.getState()
  try {
    if (!selectedComment?.id || !selectedComment?.postId) {
      console.error("댓글 업데이트 오류: 댓글 ID와 게시물 ID가 필요합니다.")
      return
    }

    const response = await fetch(`/api/comments/${selectedComment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: selectedComment.body }),
    })
    const data = await response.json()
    setComments(
      data.postId,
      comments[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
    )
    setShowEditCommentDialog(false)
  } catch (error) {
    console.error("댓글 업데이트 오류:", error)
  }
}
