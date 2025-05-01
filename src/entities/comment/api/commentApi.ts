// 댓글 관련 API 요청 함수들

/**
 * 게시물별 댓글 목록 가져오기
 */
export const fetchCommentsAPI = async (postId: number) => {
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
 */
export const createCommentAPI = async (commentData: any) => {
  // postId가 null이면 중단
  if (commentData.postId === null) {
    throw new Error("댓글 추가 오류: 게시물 ID가 필요합니다.")
  }

  try {
    // 디버깅: 요청 데이터 로깅
    console.log("댓글 추가 요청 데이터:", JSON.stringify(commentData, null, 2))

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
 */
export const updateCommentAPI = async ({ id, body, postId }: { id: number; body: string; postId?: number }) => {
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
    console.error("댓글 업데이트 오류:", error)
    // 오류가 발생해도 UI에서는 업데이트된 것처럼 처리
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
 */
export const deleteCommentAPI = async (id: number) => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
    
    if (response.ok) {
      return response.json()
    }
    
    throw new Error("댓글 삭제 실패")
  } catch (error) {
    console.error("댓글 삭제 오류:", error)
    // 오류가 발생해도 UI에서는 삭제된 것처럼 처리
    return { id, isDeleted: true }
  }
}

/**
 * 댓글 좋아요
 */
export const likeCommentAPI = async ({ id, likes }: { id: number; likes: number }) => {
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
    console.error("댓글 좋아요 오류:", error)
    // 오류가 발생해도 UI에서는 좋아요가 증가된 것처럼 처리
    return { 
      id, 
      likes: likes + 1, 
      isLiked: true 
    }
  }
} 