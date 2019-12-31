interface User {
  id: string
  name: string
  currentRoomId?: string
  createdAt: Date
  updatedAt: Date
  ready: boolean
}

interface UserDatabase {
  [id: string]: User
}
