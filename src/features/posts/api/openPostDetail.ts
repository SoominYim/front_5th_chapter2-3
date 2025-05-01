import Post from "../../../entities/post/model/type"
import usePostsStore from "../model/usePostsStore"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { fetchCommentsAPI } from "../../../entities/comment/api/commentApi"

export const openPostDetail = async (post: Post) => {
  const { setSelectedPost, setShowPostDetailDialog } = usePostsStore.getState()
  const { comments, setComments } = useCommentStore.getState()
  
  setSelectedPost(post)
  setShowPostDetailDialog(true)
  
  // 이미 불러온 댓글이 있는지 확인
  if (!comments[post.id] || comments[post.id].length === 0) {
    try {
      const data = await fetchCommentsAPI(post.id)
      
      // 클라이언트에서 추가한 댓글이 있다면 합치기
      if (comments[post.id] && comments[post.id].length > 0) {
        // API에서 받은 댓글과 기존 댓글 중복 제거하여 합치기
        const existingIds = new Set(comments[post.id].map(c => c.id))
        const newComments = [
          ...comments[post.id],
          ...data.comments.filter(c => !existingIds.has(c.id))
        ]
        setComments(post.id, newComments)
      } else {
        // 기존 댓글이 없는 경우에만 API 결과로 설정
        setComments(post.id, data.comments)
      }
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }
}
