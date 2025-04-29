import SearchFilter from "./SearchFilter"
import TagFilter from "./TagFilter"
import SortFilters from "./SortFilters"

export default function FilterWrapper() {
  return (
    <div className="flex gap-4">
      <SearchFilter />
      <TagFilter />
      <SortFilters />
    </div>
  )
}


