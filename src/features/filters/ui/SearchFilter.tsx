import { Search } from "lucide-react"
import { Input } from "../../../shared/ui"
import useFilterStore from "../model/useFilterStore"
import { useState } from "react"

export default function SearchFilter() {
  const { searchQuery, setSearchQuery, setSkip } = useFilterStore()
  const [inputValue, setInputValue] = useState(searchQuery)

  const handleSearch = () => {
    // inputValue가 비어있어도 검색 실행 (리셋 목적)
    setSearchQuery(inputValue)
    setSkip(0)
  }

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
    </div>
  )
}
