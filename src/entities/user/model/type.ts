interface UserState {
  showUserModal: boolean
  selectedUser: User | null
  setShowUserModal: (show: boolean) => void
  setSelectedUser: (user: User | null) => void
}

interface User {
  id: number
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
export type { User, UserState }
