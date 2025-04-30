import React from "react"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import { Button } from "../../../shared/ui/Button"
import highlightText from "../../../shared/lib/util/highlightText"
import useFilterStore from "../../filters/model/useFilterStore"
import useCommentStore from "../model/useCommentStore"
import { deleteComment } from "../api/deleteComment"
import { likeComment } from "../api/likeComment"

interface CommentsListProps {
  postId: number
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
  const { searchQuery } = useFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
    })),
  )
  const { comments, setSelectedComment, setNewComment, setShowAddCommentDialog, setShowEditCommentDialog } =
    useCommentStore(
      useShallow((state) => ({
        comments: state.comments,
        setComments: state.setComments,
        setSelectedComment: state.setSelectedComment,
        setNewComment: state.setNewComment,
        setShowAddCommentDialog: state.setShowAddCommentDialog,
        setShowEditCommentDialog: state.setShowEditCommentDialog,
      })),
    )
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment({ body: "", postId: postId, userId: 1, user: { username: "", id: 1 }, likes: 0 })
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user?.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id as number, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id as number, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentsList
