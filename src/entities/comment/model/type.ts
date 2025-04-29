 interface Comment {
  id: number
  body: string
  postId: number
  user: {
    username: string
    id: number
  }
  likes: number
}

export default Comment
