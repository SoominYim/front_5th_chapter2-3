import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui/Dialog"
import usePostsStore from "../../features/posts/model/usePostsStore"
import useFilterStore from "../../features/filters/model/useFilterStore"
import useCommentStore from "../../features/comments/model/useCommentStore"
import CommentsList from "../../features/comments/ui/CommentsList"
import highlightText from "../../shared/lib/util/highlightText"
import { fetchComments } from "../../entities/comment/api/fetchComments"
import { likeComment } from "../../features/comments/api/likeComment"
import { deleteComment } from "../../features/comments/api/deleteComment"
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

  const { comments, setSelectedComment, setNewComment, setShowAddCommentDialog, setShowEditCommentDialog } =
    useCommentStore(
      useShallow((state) => ({
        comments: state.comments,
        setSelectedComment: state.setSelectedComment,
        setNewComment: state.setNewComment,
        setShowAddCommentDialog: state.setShowAddCommentDialog,
        setShowEditCommentDialog: state.setShowEditCommentDialog,
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
          {selectedPost?.id && (
            <CommentsList
              postId={selectedPost.id}
              comments={comments}
              searchQuery={searchQuery}
              setNewComment={setNewComment}
              setShowAddCommentDialog={setShowAddCommentDialog}
              likeComment={likeComment}
              setSelectedComment={setSelectedComment}
              setShowEditCommentDialog={setShowEditCommentDialog}
              deleteComment={deleteComment}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailDialog
