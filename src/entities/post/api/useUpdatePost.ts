import { useMutation, useQueryClient } from "@tanstack/react-query"
import usePostsStore from "../../../features/posts/model/usePostsStore"
import { useShallow } from "zustand/shallow"

// API 요청 함수 분리
export const updatePostAPI = async (postData: any) => {
  const response = await fetch(`/api/posts/${postData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  
  if (!response.ok) {
    throw new Error("게시물 업데이트 실패")
  }
  
  return response.json()
}

// 게시물 업데이트
export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const { selectedPost, posts, setPosts, setShowEditDialog } = usePostsStore(
    useShallow((state) => ({
      selectedPost: state.selectedPost,
      posts: state.posts,
      setPosts: state.setPosts,
      setShowEditDialog: state.setShowEditDialog,
    })),
  )

  // TanStack Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: updatePostAPI,
    onSuccess: (data) => {
      // 기존 상태 업데이트 방식 유지
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      
      // 추가적으로 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      
      // UI 상태 초기화
      setShowEditDialog(false)
    },
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    }
  })

  const updatePost = () => {
    if (selectedPost) {
      mutation.mutate(selectedPost)
    }
  }

  return { 
    updatePost,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
}
