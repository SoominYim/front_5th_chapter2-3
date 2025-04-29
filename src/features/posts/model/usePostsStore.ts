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
  tags: string[]
  selectedTag: string
  newPost: Post
  showAddDialog: boolean
  showEditDialog: boolean
  showPostDetailDialog: boolean

  setTotal: (total: number) => void
  setPosts: (posts: Post[]) => void
  setSelectedPost: (post: Post | null) => void
  setTags: (tags: string[]) => void
  setSelectedTag: (tag: string) => void
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
  tags: [],
  selectedTag: "",
  newPost: { title: "", body: "", userId: 1 },
  showAddDialog: false,
  showEditDialog: false,
  showPostDetailDialog: false,

  setTotal: (total) => set({ total }),
  setPosts: (posts) => set({ posts }),
  setSelectedPost: (post) => set({ selectedPost: post }),
  setTags: (tags) => set({ tags }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setNewPost: (post) => set({ newPost: post }),
  setShowAddDialog: (show) => set({ showAddDialog: show }),
  setShowEditDialog: (show) => set({ showEditDialog: show }),
  setShowPostDetailDialog: (show) => set({ showPostDetailDialog: show }),
}))

export default usePostsStore
