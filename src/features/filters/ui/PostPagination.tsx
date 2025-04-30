import { Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../shared/ui"
import { useShallow } from "zustand/shallow"
import useFilterStore from "../model/useFilterStore"
import { usePostsQuery } from "../../../entities/post/model/queries"

const PostsPagination = () => {
  const { limit, setLimit, skip, setSkip, searchQuery, selectedTag, sortBy, sortOrder } = useFilterStore(
    useShallow((state) => ({
      limit: state.limit,
      setLimit: state.setLimit,
      skip: state.skip,
      setSkip: state.setSkip,
      searchQuery: state.searchQuery,
      selectedTag: state.selectedTag,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    })),
  )

  // 직접 쿼리 결과 사용
  const { data } = usePostsQuery({
    skip,
    limit,
    tag: selectedTag,
    searchQuery,
    sortBy,
    sortOrder,
  })

  const total = data?.total || 0

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
          다음
        </Button>
      </div>
    </div>
  )
}

export default PostsPagination
