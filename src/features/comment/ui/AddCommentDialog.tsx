import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../shared/ui"
import useCommentStore from "../model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { useCreateComment } from "../../../entities/comment/actions/useCreateComment"

const AddCommentDialog = () => {
  const { showAddCommentDialog, setShowAddCommentDialog, newComment, setNewComment } = useCommentStore(
    useShallow((state) => ({
      showAddCommentDialog: state.showAddCommentDialog,
      setShowAddCommentDialog: state.setShowAddCommentDialog,
      newComment: state.newComment,
      setNewComment: state.setNewComment,
    })),
  )
  const { addComment } = useCreateComment()
  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCommentDialog
