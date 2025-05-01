import { useShallow } from "zustand/shallow"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { Input } from "../../../shared/ui/Input"
import { Textarea } from "../../../shared/ui/Textarea"
import { Button } from "../../../shared/ui/Button"
import usePostsStore from "../model/usePostsStore"
import { useCreatePost } from "../../../entities/post/hooks/useCreatePost"
const AddPostDialog = () => {
  const { newPost, showAddDialog, setNewPost, setShowAddDialog } = usePostsStore(
    useShallow((state) => ({
      newPost: state.newPost,
      showAddDialog: state.showAddDialog,
      setNewPost: state.setNewPost,
      setShowAddDialog: state.setShowAddDialog,
    })),
  )
  const { addPost } = useCreatePost()

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={addPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddPostDialog
