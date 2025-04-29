import { create } from "zustand"

interface Comment {
  id?: number
  body: string
  postId: number | null
  userId: number
}

interface CommentState {
  comments: Record<number, Comment[]>
  selectedComment: Comment | null
  newComment: Comment
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean

  setComments: (postId: number, comments: Comment[]) => void
  setSelectedComment: (comment: Comment | null) => void
  setNewComment: (comment: Comment) => void
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
}

const useCommentsStore = create<CommentState>((set) => ({
  comments: {},
  selectedComment: null,
  newComment: { body: "", postId: null, userId: 1 },
  showAddCommentDialog: false,
  showEditCommentDialog: false,

  setComments: (postId, comments) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: comments },
    })),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  setNewComment: (comment) => set({ newComment: comment }),
  setShowAddCommentDialog: (show) => set({ showAddCommentDialog: show }),
  setShowEditCommentDialog: (show) => set({ showEditCommentDialog: show }),
}))

export default useCommentsStore
