import { create } from "zustand"
import { UserState } from "../../../entities/user/model/type"

const useUserStore = create<UserState>((set) => ({
  showUserModal: false,
  selectedUser: {
    id: 0,
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
