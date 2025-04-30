import React from "react"
import { Table, TableBody } from "../../../../shared/ui/Table"
import PostsTableHeader from "./PostsTableHeader"
import PostsTableBody from "./PostsTableBody"

const PostsTable: React.FC = () => {
  return (
    <Table>
      <PostsTableHeader />
      <TableBody>
        <PostsTableBody />
      </TableBody>
    </Table>
  )
}

export default PostsTable
