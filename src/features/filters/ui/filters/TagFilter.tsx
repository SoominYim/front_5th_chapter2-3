import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../shared/ui"
import { useShallow } from "zustand/shallow"
import useFilterStore from "../../model/useFilterStore"
export default function TagFilter() {
  const { tags, selectedTag, setSelectedTag, setSkip } = useFilterStore(
    useShallow((state) => ({
      tags: state.tags,
      selectedTag: state.selectedTag,
      setSelectedTag: state.setSelectedTag,
      setSkip: state.setSkip,
    })),
  )

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
        {tags.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
