interface User {
  id: string
  name: string
  currentRoomId?: string
  createdAt: Date
  updatedAt: Date
}

interface UserDatabase {
  [id: string]: User
}
