import { create } from "zustand"

interface User {
  id: number
  name: string
  email: string
  password: string
}

interface UserState {
  showUserModal: boolean
  selectedUser: User | null
  setShowUserModal: (show: boolean) => void
  setSelectedUser: (user: User | null) => void
}

const useUserStore = create<UserState>((set) => ({
  showUserModal: false,
  selectedUser: null,
  setShowUserModal: (show) => set({ showUserModal: show }),
  setSelectedUser: (user) => set({ selectedUser: user }),
}))

export default useUserStore
