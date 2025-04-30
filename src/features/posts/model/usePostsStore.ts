import { create } from "zustand"

interface Post {
  id?: number
  title: string
  body?: string
  tags?: string[]
  userId?: number
}

interface PostState {
  total: number
  posts: Post[]
  selectedPost: Post | null
  newPost: Post
  showAddDialog: boolean
  showEditDialog: boolean
  showPostDetailDialog: boolean

  setTotal: (total: number) => void
  setPosts: (posts: Post[]) => void
  setSelectedPost: (post: Post | null) => void
  setNewPost: (post: Post) => void
  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setShowPostDetailDialog: (show: boolean) => void
}

const usePostsStore = create<PostState>((set) => ({
  total: 0,
  posts: [],
  selectedPost: {
    id: 0,
    title: "",
    body: "",
    tags: [],
    userId: 0,
  },
  newPost: { title: "", body: "", userId: 1 },
  showAddDialog: false,
  showEditDialog: false,
  showPostDetailDialog: false,

  setTotal: (total) => set({ total }),
  setPosts: (posts) => set({ posts }),
  setSelectedPost: (post) => set({ selectedPost: post }),
  setNewPost: (post) => set({ newPost: post }),
  setShowAddDialog: (show) => set({ showAddDialog: show }),
  setShowEditDialog: (show) => set({ showEditDialog: show }),
  setShowPostDetailDialog: (show) => set({ showPostDetailDialog: show }),
}))

export default usePostsStore
