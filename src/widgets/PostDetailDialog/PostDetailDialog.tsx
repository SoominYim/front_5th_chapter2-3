import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui/Dialog"
import usePostsStore from "../../features/posts/model/usePostsStore"
import useFilterStore from "../../features/filters/model/useFilterStore"
import CommentsList from "../../features/comment/ui/CommentsList"
import highlightText from "../../shared/lib/util/highlightText"
import { useFetchComments } from "../../entities/comment/hooks/useFetchComments"
import { useShallow } from "zustand/shallow"

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

  // 댓글 가져오기 - 선택된 포스트가 있을 때만 실행
  const postId = selectedPost?.id
  const { isLoading } = useFetchComments(postId || 0, !!postId)

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {selectedPost?.id && <CommentsList postId={selectedPost.id} />}
          {isLoading && <div className="text-sm text-gray-500">댓글 로딩 중...</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailDialog
