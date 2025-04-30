import React from "react"
import { Table, TableBody } from "../../../../shared/ui/Table"
import PostsTableHeader from "./PostsTableHeader"
import PostsTableBody from "./PostsTableBody"
import usePostsStore from "../../model/usePostsStore"
import { useShallow } from "zustand/shallow"
import { PostTablePost } from "../../../../entities/post/model/type"

const PostsTable: React.FC = () => {
  const posts = usePostsStore(useShallow((state) => state.posts))
  return (
    <Table>
      <PostsTableHeader />
      <TableBody>
        <PostsTableBody posts={posts as unknown as PostTablePost[]} />
      </TableBody>
    </Table>
  )
}

export default PostsTable
