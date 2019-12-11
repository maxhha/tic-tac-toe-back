import { generateID } from "../utils"
import { User } from "../users"

export interface Room {
  id: string,
  name: string,
  users: User[],
  createdAt: Date,
  active: boolean;
}

interface RoomsDatabase {
  [id: string]: Room
}

const rooms : RoomsDatabase = {}

export const getRoom = (id : string) => Promise.resolve().then(
  () => {
    if (!(id in rooms))
      throw new Error("Room not found")
    return rooms[id]
  }
)

export const createRoom = (name: string, user: User) => Promise.resolve().then(
  () => {
    let id;
    do {
      id = generateID()
    } while(id in rooms)

    return rooms[id] = {id, name, users: [user], createdAt: new Date(), active: true}
  }
)

export const findRoom = (id: string) => Promise.resolve(rooms[id] || null)

export const enterRoom = (id: string, user: User) => Promise.resolve(id)
  .then(getRoom)
  .then(room => {
    if (room.users.length >= 2)
      throw new Error("Room is full")

    room.users.push(user)

    return room
  }
)

export const exitRoom = (id: string, user: User) => Promise.resolve(id)
  .then(getRoom)
  .then(room => {
      room.users = room.users.filter(u => !Object.is(u, user))
      return room
  }
)
