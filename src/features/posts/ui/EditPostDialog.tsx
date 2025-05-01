import { useShallow } from "zustand/shallow"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { Input } from "../../../shared/ui/Input"
import { Textarea } from "../../../shared/ui/Textarea"
import { Button } from "../../../shared/ui/Button"
import usePostsStore from "../model/usePostsStore"
import { useUpdatePost } from "../../../entities/post/hooks/useUpdatePost"

const EditPostDialog = () => {
  const { showEditDialog, setShowEditDialog, selectedPost, setSelectedPost } = usePostsStore(
    useShallow((state) => ({
      showEditDialog: state.showEditDialog,
      setShowEditDialog: state.setShowEditDialog,
      selectedPost: state.selectedPost,
      setSelectedPost: state.setSelectedPost,
    })),
  )
  const { updatePost } = useUpdatePost()

  // 게시물 수정 처리하는 함수
  const handleUpdate = () => {
    if (selectedPost) {
      updatePost()
    }
  }

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => {
              if (selectedPost) {
                setSelectedPost({ ...selectedPost, title: e.target.value })
              }
            }}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => {
              if (selectedPost) {
                setSelectedPost({ ...selectedPost, body: e.target.value })
              }
            }}
          />
          <Button onClick={handleUpdate}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditPostDialog
