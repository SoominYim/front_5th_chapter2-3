import { Post } from "../../../entities/post/model/type"
import usePostsStore from "../model/usePostsStore"
import { fetchComments } from "../../../entities/comment/api/fetchComments"

export const openPostDetail = (post: Post) => {
  const { setSelectedPost, setShowPostDetailDialog } = usePostsStore.getState()

  setSelectedPost(post)
  fetchComments(post.id)
  setShowPostDetailDialog(true)
}
