import { generateID } from "../utils"

export interface Room {
  id: string,
  name: string,
  users: string[],
}

interface RoomsDatabase {
  [id: string]: Room
}

const rooms : RoomsDatabase = {}

export const createRoom = (name: string, user: string) => Promise.resolve().then(
  () => {
    let id;
    do {
      id = generateID()
    } while(id in rooms)

    return rooms[id] = {id, name, users: [user]}
  }
)

export const findRoom = (id: string) => Promise.resolve().then(
  () => rooms[id] || null
)

export const enterRoom = (id: string, user: string) => Promise.resolve().then(
  () => {
    if (!(id in rooms))
      throw new Error("Room not found")

    let room = rooms[id]

    if (room.users.length >= 2)
      throw new Error("Room is full")

    room.users.push(user)
    
    return room
  }
)
