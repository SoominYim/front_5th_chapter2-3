import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui/Dialog"
import usePostsStore from "../../features/posts/model/usePostsStore"
import useFilterStore from "../../features/filters/model/useFilterStore"
import CommentsList from "../../features/comment/ui/CommentsList"
import highlightText from "../../shared/lib/util/highlightText"
import { fetchComments } from "../../entities/comment/api/fetchComments"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"

const PostDetailDialog = () => {
  const { showPostDetailDialog, setShowPostDetailDialog, selectedPost } = usePostsStore(
    useShallow((state) => ({
      showPostDetailDialog: state.showPostDetailDialog,
      setShowPostDetailDialog: state.setShowPostDetailDialog,
      selectedPost: state.selectedPost,
    })),
  )

  const { searchQuery } = useFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
    })),
  )

  // selectedPost가 변경될 때 댓글 가져오기
  useEffect(() => {
    if (selectedPost?.id) {
      fetchComments(selectedPost.id)
    }
  }, [selectedPost?.id])

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {selectedPost?.id && <CommentsList postId={selectedPost.id} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailDialog
