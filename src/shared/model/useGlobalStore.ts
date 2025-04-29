import { create } from "zustand"

interface GlobalState {
  loading: boolean

  setLoading: (loading: boolean) => void
}

const useGlobalStore = create<GlobalState>((set) => ({
  loading: false,

  setLoading: (loading) => set({ loading }),
}))

export default useGlobalStore
