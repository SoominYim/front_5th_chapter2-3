import usePostsStore from "../model/usePostsStore"
import { useShallow } from "zustand/shallow"

// 게시물 삭제를 위한 커스텀 훅
export const useDeletePost = () => {
  const { posts, setPosts } = usePostsStore(
    useShallow((state) => ({
      posts: state.posts,
      setPosts: state.setPosts,
    })),
  )

  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  return { deletePost }
}
