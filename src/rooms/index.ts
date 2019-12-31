import { generateID } from "../utils"
import {
  getUser,
  setUserRoom,
  setUserReady,
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

export const startGameInRoom = (id: string) => Promise.resolve(id)
  .then(getRoom)
  .then(async room => {
    const users = await Promise.all(room.users.map(getUser))
    if (users.length !== 2) {
      throw new Error("Not enough users")
    }
    if (!(users[0].ready && users[1].ready)) {
      throw new Error("Not all users ready")
    }

    room.gameActive = true
    room.board = createBoard(room)
    return updateRoom(room)
  })

export const finishGameInRoom = (id: string) => Promise.resolve(id)
  .then(getRoom)
  .then(async room => {
    if (!room.gameActive)
      throw new Error("Game is not active")
    if (!room.board)
      throw new Error("No board in room")
    if (!room.board.winner)
      throw new Error("No winner")

    room.gameActive = false
    await Promise.all(
      room.users.map((id => setUserReady(id, false)))
    )
    return updateRoom(room)
  })

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

    return updateRoom(room)
  })

export const exitRoom = (id: string, user: User) => Promise.resolve(id)
  .then(getRoom)
  .then(async room => {
      room.users = room.users.filter(id => id !== user.id)
      await setUserRoom(user.id)
      if (room.board) {
        room.board = undefined
        room.gameActive = false
      }
      return updateRoom(room)
  }
)
