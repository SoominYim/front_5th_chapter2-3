import { useEffect, useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../shared/ui"
import { useShallow } from "zustand/shallow"
import useFilterStore from "../model/useFilterStore"
import { useTagsQuery } from "../../../entities/post/model/queries"
import { memo } from "react"

interface Tag {
  url: string
  slug: string
}

// 가상화된 태그 목록 컴포넌트
const VirtualizedTags = memo(({ tags, onSelect }: { tags: Tag[]; onSelect: (value: string) => void }) => {
  const [visibleTags, setVisibleTags] = useState<Tag[]>([])

  // 스크롤 이벤트 핸들러 추가
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight } = e.currentTarget

    // 현재 보이는 영역 계산 (각 항목 높이는 약 35px로 가정)
    const startIndex = Math.floor(scrollTop / 35)
    const endIndex = Math.min(startIndex + Math.ceil(clientHeight / 35) + 5, tags.length)

    // 화면에 보이는 태그만 렌더링
    setVisibleTags(tags.slice(startIndex, endIndex))
  }

  // 컴포넌트 마운트 시 초기 태그 설정
  useEffect(() => {
    setVisibleTags(tags.slice(0, 20))
  }, [tags])

  return (
    <div
      className="max-h-[200px] overflow-y-auto"
      onScroll={handleScroll}
      style={{ height: `${Math.min(tags.length * 35, 200)}px` }}
    >
      {visibleTags.map((tag: Tag) => (
        <SelectItem key={tag.url} value={tag.slug} onClick={() => onSelect(tag.slug)}>
          {tag.slug}
        </SelectItem>
      ))}
    </div>
  )
})

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

  // 태그 데이터를 직접 쿼리 - 캐싱 활용
  const { data: tagsData, isLoading } = useTagsQuery()

  // 태그 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (tagsData) {
      setTags(tagsData)
    }
  }, [tagsData, setTags])

  // 태그 선택 핸들러
  const handleTagSelect = (value: string) => {
    setSelectedTag(value)
    setSkip(0)
  }

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
          tagsData && <VirtualizedTags tags={tagsData} onSelect={handleTagSelect} />
        )}
      </SelectContent>
    </Select>
  )
}

export default memo(TagFilter)
