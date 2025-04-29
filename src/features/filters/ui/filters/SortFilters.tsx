import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../shared/ui"
import useFilterStore from "../../model/useFilterStore"

export default function SortFilters() {
  const { sortBy, setSortBy, sortOrder, setSortOrder, setSkip } = useFilterStore()
  
  return (
    <>
      <Select 
        value={sortBy} 
        onValueChange={(value) => {
          setSortBy(value)
          setSkip(0)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      
      <Select 
        value={sortOrder} 
        onValueChange={(value) => {
          setSortOrder(value)
          setSkip(0)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
} 