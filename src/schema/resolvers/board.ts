import { getUser } from "../../users"
import {
  getRoom,
  updateRoom,
} from "../../rooms"
import {
  makeStep,
} from "../../boards"

export default {
  Board: {
    order(
      { order }: Board
    ) {
      return Promise.all(order.map(getUser))
    },
    currentPlayer(
      { currentPlayer }: Board,
    ) {
      return currentPlayer ? getUser(currentPlayer) : null
    },
  },
  Cell: {
    owner(
      { owner }: BoardCell,
    ) {
      return getUser(owner)
    },
  },
  Query: {
    async board(
      _parent: any,
      _variables: any,
      { currentRoomId }: ResolverContext,
    ) {
      if (!currentRoomId) return null

      const room = await getRoom(currentRoomId)

      return room.board || null
    }
  },
  Mutation: {
    async makeStep(
      _parent: any,
      {
        input: { x, y }
      }: {
        input: { x: number, y: number }
      },
      { currentRoomId, userId }: ResolverContext,
    ) {
      if (!userId) return null
      if (!currentRoomId) return null

      const room = await getRoom(currentRoomId)

      if (!room.board)
        throw new Error("No board in the room")

      if (!room.gameActive)
        throw new Error("Game is inactive")

      const cell: BoardCell = {
        position: { x, y },
        owner: userId,
      }
      room.board = makeStep(room.board, cell)

      return updateRoom(room).then(room => room.board)
    },
  },
}
