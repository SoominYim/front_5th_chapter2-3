import { TableCell, TableRow, Button } from "../../../../shared/ui"
import { Edit2, MessageSquare, Trash2, ThumbsDown, ThumbsUp } from "lucide-react"
import { useShallow } from "zustand/shallow"
import { useURLParams } from "../../../../shared/lib/hooks/useURLParams"
import { useDeletePost } from "../../api"
import { openUserModal } from "../../../user/api/openUserModal"
import { openPostDetail } from "../../api/openPostDetail"
import highlightText from "../../../../shared/lib/util/highlightText"
import usePostsStore from "../../model/usePostsStore"
import useFilterStore from "../../../filters/model/useFilterStore"

import Post from "../../../../entities/post/model/type"

// Post 타입을 PostTablePost로 확장
interface PostTablePost extends Post {
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
}

const PostsTableBody = () => {
  const { posts, setSelectedPost, setShowEditDialog } = usePostsStore(
    useShallow((state) => ({
      posts: state.posts as unknown as PostTablePost[],
      setSelectedPost: state.setSelectedPost,
      setShowEditDialog: state.setShowEditDialog,
    })),
  )
  const { searchQuery, selectedTag, setSelectedTag } = useFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      selectedTag: state.selectedTag,
      setSelectedTag: state.setSelectedTag,
    })),
  )
  const { updateURL } = useURLParams()
  const { deletePost } = useDeletePost()

  return (
    <>
      {posts.map((post: PostTablePost) => (
        <TableRow key={post.id}>
          <TableCell>{post.id}</TableCell>
          <TableCell>
            <div className="space-y-1">
              <div>{highlightText(post.title, searchQuery)}</div>

              <div className="flex flex-wrap gap-1">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                      selectedTag === tag
                        ? "text-white bg-blue-500 hover:bg-blue-600"
                        : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                    }`}
                    onClick={() => {
                      setSelectedTag(tag)
                      updateURL({ tag })
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author)}>
              <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
              <span>{post.author?.username}</span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.reactions?.likes || 0}</span>
              <ThumbsDown className="w-4 h-4" />
              <span>{post.reactions?.dislikes || 0}</span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPost(post)
                  setShowEditDialog(true)
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default PostsTableBody
