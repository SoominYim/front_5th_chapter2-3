import { create } from "zustand"

interface Tag {
  id: string
  name: string
  slug: string
  url: string
}
interface FilterState {
  searchQuery: string
  sortBy: string
  sortOrder: string
  skip: number
  limit: number
  tags: Tag[]
  selectedTag: string
  setSortBy: (sortBy: string) => void
  setSortOrder: (order: string) => void
  setSearchQuery: (query: string) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setTags: (tags: Tag[]) => void
  setSelectedTag: (tag: string) => void
}

const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  sortBy: "",
  sortOrder: "asc",
  skip: 0,
  limit: 10,
  tags: [],
  selectedTag: "",
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),
  setTags: (tags) => set({ tags }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}))

export default useFilterStore
