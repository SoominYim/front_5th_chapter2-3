import { useEffect, useState, useCallback, useRef } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../shared/ui"
import { useShallow } from "zustand/shallow"
import useFilterStore from "../model/useFilterStore"
import { useTagsQuery } from "../../../entities/post/model/queries"
import { memo } from "react"

interface Tag {
  url: string
  slug: string
}

// 무한 스크롤 태그 목록 컴포넌트
const InfiniteTagsList = memo(({ tags, onSelect }: { tags: Tag[]; onSelect: (value: string) => void }) => {
  const [visibleCount, setVisibleCount] = useState(20)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 교차점 관찰자 생성 (무한 스크롤)
  useEffect(() => {
    if (!loadingRef.current) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isLoading && visibleCount < tags.length) {
          setIsLoading(true)
          
          // 추가 데이터 로드 지연 (사용자 경험 향상)
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + 20, tags.length))
            setIsLoading(false)
          }, 300)
        }
      },
      { threshold: 0.1 }
    )
    
    observer.observe(loadingRef.current)
    
    return () => {
      observer.disconnect()
    }
  }, [tags, visibleCount, isLoading])
  
  // 현재 보여줄 태그 목록
  const displayedTags = tags.slice(0, visibleCount)
  
  // 태그 클릭 핸들러
  const handleTagClick = useCallback((tag: Tag) => (e: React.MouseEvent) => {
    e.preventDefault()
    onSelect(tag.slug)
  }, [onSelect])
  
  return (
    <div 
      ref={containerRef}
      className="max-h-[200px] overflow-y-auto" 
      style={{ scrollBehavior: 'smooth' }}
    >
      {displayedTags.map((tag: Tag) => (
        <SelectItem 
          key={tag.url} 
          value={tag.slug} 
          onClick={handleTagClick(tag)}
        >
          {tag.slug}
        </SelectItem>
      ))}
      
      {/* 로더 요소 - 이 요소가 보이면 추가 태그 로드 */}
      {visibleCount < tags.length && (
        <div 
          ref={loadingRef} 
          className="py-1 text-center text-xs text-gray-500"
        >
          {isLoading ? '로드 중...' : '스크롤하여 더 보기'}
        </div>
      )}
    </div>
  )
})

// 메인 태그 필터 컴포넌트
function TagFilter() {
  const { selectedTag, setSelectedTag, setSkip, setTags } = useFilterStore(
    useShallow((state) => ({
      tags: state.tags,
      selectedTag: state.selectedTag,
      setSelectedTag: state.setSelectedTag,
      setSkip: state.setSkip,
      setTags: state.setTags,
    })),
  )

  // 태그 데이터를 직접 쿼리
  const { data: tagsData, isLoading } = useTagsQuery()
  
  // 태그 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (tagsData && tagsData.length > 0) {
      setTags(tagsData)
    }
  }, [tagsData, setTags])

  // 태그 선택 핸들러
  const handleTagSelect = useCallback((value: string) => {
    setSelectedTag(value)
    setSkip(0)
  }, [setSelectedTag, setSkip])

  return (
    <Select value={selectedTag} onValueChange={handleTagSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            로딩 중...
          </SelectItem>
        ) : (
          tagsData && tagsData.length > 0 && (
            <InfiniteTagsList 
              tags={tagsData} 
              onSelect={handleTagSelect} 
            />
          )
        )}
      </SelectContent>
    </Select>
  )
}

export default memo(TagFilter)