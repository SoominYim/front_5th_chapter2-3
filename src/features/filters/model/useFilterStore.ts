import { create } from "zustand"

interface FilterState {
  searchQuery: string
  sortBy: string
  sortOrder: string
  skip: number
  limit: number

  setSortBy: (sortBy: string) => void
  setSortOrder: (order: string) => void
  setSearchQuery: (query: string) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
}

const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  sortBy: "",
  sortOrder: "",
  skip: 0,
  limit: 10,

  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),
}))

export default useFilterStore
