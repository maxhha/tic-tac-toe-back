import { getUser } from "../../users"
import { getRoom } from "../../rooms"

export default {
  Board: {
    order(
      { order }: Board
    ) {
      return Promise.all(order.map(getUser))
    }
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
}
