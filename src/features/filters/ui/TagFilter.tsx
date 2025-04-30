import { useEffect, useMemo } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../shared/ui"
import { useShallow } from "zustand/shallow"
import useFilterStore from "../model/useFilterStore"
import { useTagsQuery } from "../../../entities/post/model/queries"
import { memo } from "react"

interface Tag {
  url: string
  slug: string
}

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
    if (tagsData) {
      setTags(tagsData)
    }
  }, [tagsData, setTags])

  // 태그 아이템 메모이제이션
  const tagItems = useMemo(() => {
    if (!tagsData) return null

    return tagsData.map((tag: Tag) => (
      <SelectItem key={tag.url} value={tag.slug}>
        {tag.slug}
      </SelectItem>
    ))
  }, [tagsData])

  return (
    <Select
      value={selectedTag}
      onValueChange={(value) => {
        setSelectedTag(value)
        setSkip(0)
      }}
    >
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
          tagItems
        )}
      </SelectContent>
    </Select>
  )
}

export default memo(TagFilter)
