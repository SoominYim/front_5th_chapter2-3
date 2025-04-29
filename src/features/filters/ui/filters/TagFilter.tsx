import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../shared/ui"
import useFilterStore from "../../model/useFilterStore"
import usePostsStore from "../../../posts/model/usePostsStore"

export default function TagFilter() {
  const { setSkip } = useFilterStore()
  const { tags, selectedTag, setSelectedTag } = usePostsStore()
  
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