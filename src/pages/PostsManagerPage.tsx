import { useEffect } from "react"
import { useShallow } from "zustand/shallow"

// Components
import AddPostDialog from "../features/posts/ui/AddPostDialog.tsx"
import EditPostDialog from "../features/posts/ui/EditPostDialog.tsx"
import UserModal from "../widgets/userModal/UserModal.tsx"
import PostsPagination from "../features/filters/ui/PostPagination.tsx"
import FilterWrapper from "../features/filters/ui/FilterWrapper.tsx"
import AddCommentDialog from "../features/comment/ui/AddCommentDialog.tsx"
import EditCommentDialog from "../features/comment/ui/EditCommentDialog.tsx"
import PostsTable from "../features/posts/ui/table/PostsTable.tsx"

// Store
import useFilterStore from "../features/filters/model/useFilterStore.ts"
import PostDetailDialog from "../widgets/PostDetailDialog/PostDetailDialog.tsx"
import PostsHeader from "../features/posts/ui/PostHeader.tsx"

// UI
import { Card, CardContent } from "../shared/ui"

// Hooks
import { useURLParams } from "../shared/lib/hooks/useURLParams.ts"

const PostsManager = () => {
  // filters 상태 관리
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

  // URL 파라미터 훅 사용
  const { updateURL } = useURLParams()

  // URL 파라미터가 변경될 때마다 자동으로 URL 업데이트
  useEffect(() => {
    updateURL({
      skip,
      limit,
      search: searchQuery,
      sortBy,
      order: sortOrder,
      tag: selectedTag,
    })
  }, [skip, limit, sortBy, sortOrder, selectedTag, searchQuery, updateURL])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostsHeader />
      <CardContent>
        <div className="flex flex-col gap-4">
          <FilterWrapper />
          <PostsTable />
          <PostsPagination />
        </div>
      </CardContent>

      {/*다이얼로그 */}
      <AddPostDialog />
      <EditPostDialog />
      <AddCommentDialog />
      <EditCommentDialog />
      <PostDetailDialog />
      <UserModal />
    </Card>
  )
}

export default PostsManager
