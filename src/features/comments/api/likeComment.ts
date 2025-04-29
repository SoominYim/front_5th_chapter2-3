
import useCommentStore from "../model/useCommentStore"

// 댓글 좋아요
export const likeComment = async (id: number, postId: number) => {
  const { comments, setComments } = useCommentStore.getState()
  try {
    const comment = comments[postId]?.find((c) => c.id === id)
    if (!comment) return

      const likes = comment.likes || 0

      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: likes + 1 }),
      })
      const data = await response.json()
      setComments(
        postId,
        comments[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: (comment.likes || 0) + 1 } : comment,
        ),
      )
    } catch (error) {
    console.error("댓글 좋아요 오류:", error)
  }
}
