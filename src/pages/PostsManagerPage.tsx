import { useEffect } from "react"
import { useShallow } from "zustand/shallow"
import PostsTable from "../features/posts/ui/PostsTable.tsx"
import AddPostDialog from "../features/posts/ui/AddPostDialog.tsx"
import EditPostDialog from "../features/posts/ui/EditPostDialog.tsx"
import UserModal from "../widgets/userModal/UserModal.tsx"
import PostsPagination from "../features/filters/ui/PostPagination.tsx"
import { useDeletePost } from "../features/posts/api/useDeletePost.ts"
import FilterWrapper from "../features/filters/ui/filters/FilterWrapper.tsx"
import { fetchComments } from "../entities/comment/api/fetchComments.ts"
import AddCommentDialog from "../features/comments/ui/AddCommentDialog.tsx"
import EditCommentDialog from "../features/comments/ui/EditCommentDialog.tsx"
// Store
import usePostsStore from "../features/posts/model/usePostsStore.ts"
import useGlobalStore from "../shared/model/useGlobalStore.ts"
import useFilterStore from "../features/filters/model/useFilterStore.ts"
import { useURLParams } from "../shared/lib/hooks/useURLParams.ts"
import { usePostsQuery, useTagsQuery } from "../features/posts/model/queries.ts"
import PostDetailDialog from "../widgets/PostDetailDialog/PostDetailDialog.tsx"
import useUserStore from "../features/user/model/useUserStore.ts"
import PostsHeader from "../features/posts/ui/PostHeader.tsx"
// UI
import { Card, CardContent } from "../shared/ui"

// util
import highlightText from "../shared/lib/util/highlightText.tsx"

// 게시물 관리 페이지
const PostsManager = () => {
  // global 상태 관리
  const { loading, setLoading } = useGlobalStore()

  // posts 상태 관리
  const {
    posts,
    selectedTag,
    setTotal,
    setPosts,
    setSelectedPost,
    setTags,
    setSelectedTag,
    setShowEditDialog,
    setShowPostDetailDialog,
  } = usePostsStore(
    useShallow((state) => ({
      total: state.total,
      posts: state.posts,
      selectedPost: state.selectedPost,
      tags: state.tags,
      selectedTag: state.selectedTag,
      showPostDetailDialog: state.showPostDetailDialog,
      setTotal: state.setTotal,
      setPosts: state.setPosts,
      setSelectedPost: state.setSelectedPost,
      setTags: state.setTags,
      setSelectedTag: state.setSelectedTag,
      setShowAddDialog: state.setShowAddDialog,
      setShowEditDialog: state.setShowEditDialog,
      setShowPostDetailDialog: state.setShowPostDetailDialog,
    })),
  )

  // filters 상태 관리
  const { searchQuery, sortBy, sortOrder, skip, limit, setSearchQuery, setSortBy, setSortOrder, setSkip, setLimit } =
    useFilterStore(
      useShallow((state) => ({
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        skip: state.skip,
        limit: state.limit,
        setSearchQuery: state.setSearchQuery,
        setSortBy: state.setSortBy,
        setSortOrder: state.setSortOrder,
        setSkip: state.setSkip,
        setLimit: state.setLimit,
      })),
    )

  // user 상태 관리
  const { setSelectedUser, setShowUserModal } = useUserStore(
    useShallow((state) => ({
      setSelectedUser: state.setSelectedUser,
      setShowUserModal: state.setShowUserModal,
    })),
  )

  // URL 파라미터 훅 사용
  const { getParam, updateURL } = useURLParams()
  const { deletePost } = useDeletePost()

  // URL에서 초기 값 가져오기
  const initialSkip = getParam("skip", 0)
  const initialLimit = getParam("limit", 10)
  const initialSearchQuery = getParam("search", "")
  const initialSortBy = getParam("sortBy", "")
  const initialSortOrder = getParam("order", "asc")
  const initialSelectedTag = getParam("tag", "")

  // 초기값으로 상태 설정
  useEffect(() => {
    setSkip(initialSkip)
    setLimit(initialLimit)
    setSearchQuery(initialSearchQuery)
    setSortBy(initialSortBy)
    setSortOrder(initialSortOrder)
    setSelectedTag(initialSelectedTag)
  }, []) // 컴포넌트 마운트 시 한 번만 실행

  // React Query 사용
  const { data: postsData, isLoading } = usePostsQuery({
    skip,
    limit,
    tag: selectedTag,
    searchQuery: searchQuery,
    sortBy,
    sortOrder,
  })

  const { data: tagsData } = useTagsQuery()

  // 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (postsData) {
      setPosts(postsData.posts)
      setTotal(postsData.total)
    }

    if (tagsData) {
      setTags(tagsData)
    }

    setLoading(isLoading)
  }, [postsData, tagsData, isLoading])

  // URL 파라미터가 변경될 때마다 자동으로 URL 업데이트
  useEffect(() => {
    updateURL({
      skip,
      limit,
      search: searchQuery,
      sortBy,
      sortOrder,
      tag: selectedTag,
    })
  }, [skip, limit, sortBy, sortOrder, selectedTag, searchQuery, updateURL])

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  const openUserModal = async (user) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <PostsTable
      posts={posts}
      searchQuery={searchQuery}
      selectedTag={selectedTag}
      setSelectedTag={setSelectedTag}
      updateURL={updateURL}
      openUserModal={openUserModal}
      openPostDetail={openPostDetail}
      setSelectedPost={setSelectedPost}
      setShowEditDialog={setShowEditDialog}
      deletePost={deletePost}
      highlightText={highlightText}
    />
  )

  // 댓글

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostsHeader />
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <FilterWrapper />

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <PostsPagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog />
      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog />

      {/* 사용자 모달 */}
      <UserModal />
    </Card>
  )
}

export default PostsManager
