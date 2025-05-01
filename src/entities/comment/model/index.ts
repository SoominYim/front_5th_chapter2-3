/**
 * 댓글 관련 모델과 쿼리 훅 내보내기
 */

// 쿼리 훅 내보내기
export { useCommentsQuery } from './commentsQuery'

// 호환성을 위한 별칭 - 기존 useFetchComments를 사용하는 컴포넌트를 위해
export { useCommentsQuery as useFetchComments } from './commentsQuery' 