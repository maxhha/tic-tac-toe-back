import { generateID } from "../utils"
import {
  setUserRoom,
} from "../users"
import {
  createBoard,
} from "../boards"

const rooms : RoomsDatabase = {}

export const getRoom = (id : string) => Promise.resolve().then(
  () => {
    if (!(id in rooms))
      throw new Error("Room not found")
    return rooms[id]
  }
)

export const findRoom = (id: string) => Promise.resolve(id in rooms ? rooms[id] : null)

export const createRoom = (name: string, user: User) => Promise.resolve().then(
  async () => {
    let id;
    do {
      id = generateID()
    } while(id in rooms)

    const room: Room = {
      id,
      name,
      users: [user.id],
      createdAt: new Date(),
      gameActive: false,
      updatedAt: new Date(),
    }

    rooms[id] = room

    return setUserRoom(user.id, room.id)
      .then(() => room)
  }
)

export const updateRoom = (room: Room) => Promise.resolve().then(
  () => {
    room.updatedAt = new Date()
    return rooms[room.id] = room
  }
)

export const enterRoom = (id: string, user: User) => Promise.resolve(id)
  .then(getRoom)
  .then(async (room) => {
    if (user.currentRoomId){
      throw new Error("User is in room")
    }
    if (room.users.length >= 2)
      throw new Error("Room is full")

    room.users = [...room.users, user.id]
    await setUserRoom(user.id, id)

    if (room.users.length === 2)
      room = startGameInRoom(room)

    return updateRoom(room)
  })

export const exitRoom = (id: string, user: User) => Promise.resolve(id)
  .then(getRoom)
  .then(async room => {
      room.users = room.users.filter(u => !Object.is(u, user))
      await setUserRoom(user.id, id)
      return updateRoom(room)
  }
)

const startGameInRoom = (room: Room) => {
  room.gameActive = true
  room.board = createBoard(room)
  return room
}
