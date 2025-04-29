
import { Button , Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../shared/ui"
import { useShallow } from "zustand/shallow"
import useFilterStore from "../model/useFilterStore"
import usePostsStore from "../../posts/model/usePostsStore"



const PostsPagination = () => {
    const { limit, setLimit, skip, setSkip } = useFilterStore(useShallow((state) => ({
        limit: state.limit,
        setLimit: state.setLimit,
        skip: state.skip,
        setSkip: state.setSkip,
    })))
    const { total } = usePostsStore(useShallow((state) => ({
        total: state.total,
    })))
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


