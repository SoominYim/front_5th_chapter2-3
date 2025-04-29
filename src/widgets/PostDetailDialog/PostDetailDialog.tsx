import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui/Dialog"
import usePostsStore from "../../features/posts/model/usePostsStore"
import useFilterStore from "../../features/filters/model/useFilterStore"
import useCommentStore from "../../features/comments/model/useCommentStore"
import CommentsList from "../../features/comments/ui/CommentsList"
import highlightText from "../../shared/lib/util/highlightText"

import { useShallow } from "zustand/shallow"
import React, { useEffect } from "react"

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

  const {
    comments,
    setComments,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
  } = useCommentStore(
    useShallow((state) => ({
      comments: state.comments,
      setComments: state.setComments,
      setSelectedComment: state.setSelectedComment,
      setNewComment: state.setNewComment,
      setShowAddCommentDialog: state.setShowAddCommentDialog,
      setShowEditCommentDialog: state.setShowEditCommentDialog,
    })),
  )

  // 댓글 관련 함수들
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments(postId, data.comments)
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  const likeComment = async (id: number, postId: number) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likes: comments[postId].find((c) => c.id === id)?.likes
            ? comments[postId].find((c) => c.id === id)!.likes + 1
            : 1,
        }),
      })
      const data = await response.json()
      setComments(
        postId,
        comments[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes ? comment.likes + 1 : 1 } : comment,
        ),
      )
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments(
        postId,
        comments[postId].filter((comment) => comment.id !== id),
      )
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

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
