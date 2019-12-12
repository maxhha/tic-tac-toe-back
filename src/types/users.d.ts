interface User {
  id: string
  name: string
  currentRoomId?: string
  createdAt: Date
}

interface UserDatabase {
  [id: string]: User
}
