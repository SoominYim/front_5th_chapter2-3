import React, { useEffect } from "react"
import { Table, TableBody } from "../../../../shared/ui/Table"
import PostsTableHeader from "./PostsTableHeader"
import PostsTableBody from "./PostsTableBody"
import usePostsStore from "../../model/usePostsStore"
import useFilterStore from "../../../filters/model/useFilterStore"
import useGlobalStore from "../../../../shared/model/useGlobalStore"
import { useShallow } from "zustand/shallow"
import { PostTablePost } from "../../../../entities/post/model/type"
import { usePostsQuery } from "../../../../entities/post/model/queries"

const PostsTable: React.FC = () => {
  // 필터 관련 상태 가져오기
  const { searchQuery, selectedTag, sortBy, sortOrder, skip, limit } = useFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      selectedTag: state.selectedTag,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      skip: state.skip,
      limit: state.limit,
    })),
  )

  // 글로벌 로딩 상태 관리
  const { setLoading } = useGlobalStore(
    useShallow((state) => ({
      setLoading: state.setLoading,
    })),
  )

  // 포스트 상태 관리
  const { setPosts, setTotal, posts } = usePostsStore(
    useShallow((state) => ({
      setPosts: state.setPosts,
      setTotal: state.setTotal,
      posts: state.posts,
    })),
  )

  // TanStack Query 사용
  const { data: postsData, isLoading } = usePostsQuery({
    skip,
    limit,
    tag: selectedTag,
    searchQuery,
    sortBy,
    sortOrder,
  })

  // 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (postsData) {
      setPosts(postsData.posts)
      setTotal(postsData.total)
    }

    setLoading(isLoading)
  }, [postsData, isLoading, setPosts, setTotal, setLoading])

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center p-4">로딩 중...</div>
      ) : (
        <Table>
          <PostsTableHeader />
          <TableBody>
            <PostsTableBody posts={posts as unknown as PostTablePost[]} />
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default PostsTable
