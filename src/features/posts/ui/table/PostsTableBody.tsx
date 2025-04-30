import PostTableRow from "./PostsTableRow"
import { PostTablePost } from "../../../../entities/post/model/type"

interface PostsTableBodyProps {
  posts: PostTablePost[]
}

const PostsTableBody = ({ posts }: PostsTableBodyProps) => {
  return (
    <>
      {posts.map((post) => (
        <PostTableRow key={post.id} post={post} />
      ))}
    </>
  )
}

export default PostsTableBody
