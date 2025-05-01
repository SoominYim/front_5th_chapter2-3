// 댓글 관련 API 요청 함수들

/**
 * 게시물별 댓글 목록 가져오기
 */
export const fetchCommentsAPI = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`)
  
  if (!response.ok) {
    throw new Error("댓글 가져오기 실패")
  }
  
  return response.json()
}

/**
 * 댓글 추가
 */
export const createCommentAPI = async (commentData: any) => {
  // postId가 null이면 중단
  if (commentData.postId === null) {
    throw new Error("댓글 추가 오류: 게시물 ID가 필요")
  }

  // 디버깅: 요청 데이터 로깅
  console.log("댓글 추가 요청 데이터:", JSON.stringify(commentData, null, 2))

  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
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

  return response.json()
}

/**
 * 댓글 업데이트
 */
export const updateCommentAPI = async ({ id, body }: { id: number; body: string }) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  })
  
  if (!response.ok) {
    throw new Error("댓글 업데이트 실패")
  }
  
  return response.json()
}

/**
 * 댓글 삭제
 */
export const deleteCommentAPI = async (id: number) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
  
  if (!response.ok) {
    throw new Error("댓글 삭제 실패")
  }
  
  return response.json()
}

/**
 * 댓글 좋아요
 */
export const likeCommentAPI = async ({ id, likes }: { id: number; likes: number }) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: likes + 1 }),
  })
  
  if (!response.ok) {
    throw new Error("댓글 좋아요 실패")
  }
  
  return response.json()
} 