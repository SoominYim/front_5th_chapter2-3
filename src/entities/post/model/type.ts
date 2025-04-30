// src/entities/post/model/type.ts
interface Post {
  id: number
  userId: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  body: string
  author: {
    username: string
    image: string
    id: number
  }
  reactions?: {
    likes: number
    dislikes: number
  }
  tags?: string[]
}

interface PostTablePost extends Post {
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
}

export default Post
export type { PostTablePost }
