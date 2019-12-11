import { generateID } from "../utils"

export interface User {
  id: string
  name: string
  currentRoomId?: string
  createdAt: Date
}

interface UserDatabase {
  [id: string]: User
}

const users : UserDatabase = {}

export const getUser = (id: string) => Promise.resolve().then(
  () => {
    if (!(id in users))
      throw new Error("User not found")
    return users[id]
  }
)

export const findUser = (id: string) => Promise.resolve(id in users ? users[id] : null)

export const createUser = (name: string) => Promise.resolve().then(
  () => {
    let id
    do {
      id = generateID()
    } while(id in users)

    const user : User = {
      id,
      name,
      createdAt: new Date(),
    }

    return users[user.id] = user
  }
)

export const setUserRoom = (id: string, roomId?: string) => Promise.resolve(id)
  .then(getUser)
  .then(
    (user) => {
      user.currentRoomId = roomId
      return user
    }
  )
