import { useEffect } from "react"
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useShallow } from "zustand/shallow"
import PostsTable from "../features/posts/ui/PostsTable.tsx"
import AddPostDialog from "../features/posts/ui/AddPostDialog.tsx"
import EditPostDialog from "../features/posts/ui/EditPostDialog.tsx"
import UserModal from "../widgets/userModal/UserModal.tsx"
import CommentsList from "../features/comments/ui/CommentsList.tsx"
import { fetchPostsByTag, searchPosts, fetchTags } from "../entities/post/api/fetchPost.ts"
import PostsPagination from "../features/filters/ui/PostPagination.tsx"
import { useDeletePost } from "../features/posts/api/useDeletePost.ts"
import FilterWrapper from "../features/filters/ui/filters/FilterWrapper.tsx"


// Store
import usePostsStore from "../features/posts/model/usePostsStore.ts"
import useCommentStore from "../features/comments/model/useCommentStore.ts"
import useGlobalStore from "../shared/model/useGlobalStore.ts"
import useFilterStore from "../features/filters/model/useFilterStore.ts"
import useUserStore from "../features/user/model/useUserStore.ts"
import { useURLParams } from "../shared/lib/hooks/useURLParams.ts"
import { usePostsQuery, useTagsQuery } from "../features/posts/model/queries.ts"

// UI
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "../shared/ui"

// util
import highlightText from "../shared/lib/util/highlightText.tsx"
const PostsManager = () => {
  // global 상태 관리
  const { loading, setLoading } = useGlobalStore()

  // posts 상태 관리
  const {
    total,
    posts,
    selectedPost,
    tags,
    selectedTag,
    showPostDetailDialog,
    setTotal,
    setPosts,
    setSelectedPost,
    setTags,
    setSelectedTag,
    setShowAddDialog,
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

  // comments 상태 관리
  const {
    comments,
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    setComments,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
  } = useCommentStore(
    useShallow((state) => ({
      comments: state.comments,
      selectedComment: state.selectedComment,
      newComment: state.newComment,
      showAddCommentDialog: state.showAddCommentDialog,
      showEditCommentDialog: state.showEditCommentDialog,
      setComments: state.setComments,
      setSelectedComment: state.setSelectedComment,
      setNewComment: state.setNewComment,
      setShowAddCommentDialog: state.setShowAddCommentDialog,
      setShowEditCommentDialog: state.setShowEditCommentDialog,
    })),
  )

  // user 상태 관리
  const { setShowUserModal, setSelectedUser } = useUserStore(
    useShallow((state) => ({
      setShowUserModal: state.setShowUserModal,
      setSelectedUser: state.setSelectedUser,
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



  // 댓글 가져오기
  const fetchComments = async (postId) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments(postId, data.comments)
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      // postId가 null이면 중단
      if (newComment.postId === null) {
        console.error("댓글 추가 오류: 게시물 ID가 필요합니다.")
        return
      }

      // 디버깅: 요청 데이터 로깅
      console.log("댓글 추가 요청 데이터:", JSON.stringify(newComment, null, 2))

      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })

      // 오류 응답 처리
      if (!response.ok) {
        const errorText = await response.text()
        console.error("댓글 추가 오류 응답:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })
        throw new Error(`서버 오류: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setComments(data.postId, [...(comments[data.postId] || []), data])
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      if (!selectedComment?.id || !selectedComment?.postId) {
        console.error("댓글 업데이트 오류: 댓글 ID와 게시물 ID가 필요합니다.")
        return
      }

      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      setComments(
        data.postId,
        comments[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      )
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id, postId) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments(
        postId,
        comments[postId].filter((comment) => comment.id !== id),
      )
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id, postId) => {
    try {
      const comment = comments[postId]?.find((c) => c.id === id)
      if (!comment) return

      const likes = comment.likes || 0

      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: likes + 1 }),
      })
      const data = await response.json()
      setComments(
        postId,
        comments[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: (comment.likes || 0) + 1 } : comment,
        ),
      )
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
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

  const renderComments = (postId) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment({ ...newComment, postId })
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user?.username || "사용자"}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
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
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body, searchQuery)}</p>
            {renderComments(selectedPost?.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <UserModal />
    </Card>
  )
}

export default PostsManager
