import { generateID } from "../utils"

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
      ready: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return users[user.id] = user
  }
)

export const updateUser = (id: string, user: User) => Promise.resolve().then(
  () => {
    user.updatedAt = new Date()
    return users[id] = user
  }
)

export const setUserRoom = (id: string, roomId?: string) => Promise.resolve(id)
  .then(getUser)
  .then(
    (user) => {
      if (user.ready) {
        throw new Error("User is ready in other room")
      }
      user.currentRoomId = roomId
      return updateUser(id, user)
    }
  )

export const setUserReady = (id: string, ready: boolean) => Promise.resolve(id)
  .then(getUser)
  .then(user => {
    user.ready = ready
    return updateUser(id, user)
  })
