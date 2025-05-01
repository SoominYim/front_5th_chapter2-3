import Post from "../../../entities/post/model/type"
import usePostsStore from "../model/usePostsStore"
import useCommentStore from "../../../features/comment/model/useCommentStore"
import { fetchCommentsAPI } from "../../../entities/comment/api/commentApi"

export const openPostDetail = async (post: Post) => {
  const { setSelectedPost, setShowPostDetailDialog } = usePostsStore.getState()
  const { setComments } = useCommentStore.getState()
  
  setSelectedPost(post)
  setShowPostDetailDialog(true)
  
  try {
    const data = await fetchCommentsAPI(post.id)
    setComments(post.id, data.comments)
  } catch (error) {
    console.error("댓글 가져오기 오류:", error)
  }
}
