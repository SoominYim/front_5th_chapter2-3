import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { Textarea } from "../../../shared/ui/Textarea"
import { Button } from "../../../shared/ui/Button"
import useCommentStore from "../model/useCommentStore"
import { useShallow } from "zustand/shallow"
import { updateComment } from "../../../entities/comment/api/updateComment"

const EditCommentDialog = () => {
  const { showEditCommentDialog, setShowEditCommentDialog, selectedComment, setSelectedComment } = useCommentStore(
    useShallow((state) => ({
      showEditCommentDialog: state.showEditCommentDialog,
      setShowEditCommentDialog: state.setShowEditCommentDialog,
      selectedComment: state.selectedComment,
      setSelectedComment: state.setSelectedComment,
    })),
  )
  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => {
              if (selectedComment) {
                setSelectedComment({
                  ...selectedComment,
                  body: e.target.value,
                  postId: selectedComment.postId ?? null,
                })
              }
            }}
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditCommentDialog
