import { create } from "zustand"

interface UserState {
  showUserModal: boolean
  selectedUser: User | null
  setShowUserModal: (show: boolean) => void
  setSelectedUser: (user: User | null) => void
}

interface User {
  image: string
  username: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address: {
    address: string
    city: string
    state: string
  }
  company: {
    name: string
    title: string
  }
}
const useUserStore = create<UserState>((set) => ({
  showUserModal: false,
  selectedUser: {
    image: "",
    username: "",
    firstName: "",
    lastName: "",
    age: 0,
    email: "",
    phone: "",
    address: {
      address: "",
      city: "",
      state: "",
    },
    company: {
      name: "",
      title: "",
    },
  },
  setShowUserModal: (show) => set({ showUserModal: show }),
  setSelectedUser: (user) => set({ selectedUser: user }),
}))

export default useUserStore
