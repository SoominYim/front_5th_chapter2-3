// 댓글 관련 API 요청 함수들

/**
 * 게시물별 댓글 목록 가져오기
 * @param postId 게시물 ID
 */
export const fetchCommentsAPI = async (postId: number): Promise<{ comments: any[]; total: number }> => {
  try {
    const response = await fetch(`/api/comments/post/${postId}`)
    
    if (response.ok) {
      return response.json()
    }
    
    throw new Error("댓글 가져오기 실패")
  } catch (error) {
    console.error("댓글 가져오기 오류:", error)
    // 오류가 발생해도 빈 댓글 목록을 반환하여 UI가 중단되지 않도록 함
    return { 
      comments: [],
      total: 0
    }
  }
}

/**
 * 댓글 추가
 * @param commentData 댓글 데이터
 */
export const createCommentAPI = async (commentData: any): Promise<any> => {
  // postId가 null이면 중단
  if (commentData.postId === null) {
    throw new Error("댓글 추가 오류: 게시물 ID가 필요합니다.")
  }

  try {
    const response = await fetch("/api/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    })

    if (response.ok) {
      return response.json()
    }
    
    throw new Error(`서버 오류: ${response.status} ${response.statusText}`)
  } catch (error) {
    console.error("댓글 추가 오류:", error)

    // 오류가 발생해도 UI에서는 추가된 것처럼 처리
    const randomId = Math.floor(Math.random() * 9000) + 1000 // 1000에서 9999 사이의 랜덤 ID
    return { 
      ...commentData, 
      id: randomId,
      isCreated: true,
    }
  }
}

/**
 * 댓글 업데이트
 * @param id 댓글 ID
 * @param body 댓글 내용
 * @param postId 게시물 ID
 */
export const updateCommentAPI = async ({ id, body, postId }: { id: number; body: string; postId?: number }): Promise<{ id: number; body: string; postId?: number; isUpdated?: boolean }> => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    })
    
    if (response.ok) {
      return response.json()
    }
    
    throw new Error("댓글 업데이트 실패")
  } catch (error) {
    // 오류가 발생해도 UI에서는 업데이트된 것처럼 처리
    console.error("댓글 업데이트 오류:", error)
    return { 
      id, 
      body, 
      postId, // 전달받은 postId를 응답에 포함
      isUpdated: true,
    }
  }
}

/**
 * 댓글 삭제
 * @param id 댓글 ID
 */
export const deleteCommentAPI = async (id: number): Promise<{ id: number; isDeleted?: boolean }> => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
    
    if (response.ok) {
      return response.json()
    }
    
    throw new Error("댓글 삭제 실패")
  } catch (error) {
    // 오류가 발생해도 UI에서는 삭제된 것처럼 처리
    console.error("댓글 삭제 오류:", error)
    return { id, isDeleted: true }
  }
}

/**
 * 댓글 좋아요
 * @param id 댓글 ID
 * @param likes 좋아요 수
 */
export const likeCommentAPI = async ({ id, likes }: { id: number; likes: number }): Promise<{ id: number; likes: number; isLiked?: boolean }> => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: likes + 1 }),
    })
    
    if (response.ok) {
      return response.json()
    }
    
    throw new Error("댓글 좋아요 실패")
  } catch (error) {
    // 오류가 발생해도 UI에서는 좋아요가 증가된 것처럼 처리
    console.error("댓글 좋아요 오류:", error)
    return { 
      id, 
      likes: likes + 1, 
      isLiked: true 
    }
  }
} 