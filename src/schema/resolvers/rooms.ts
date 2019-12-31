import { withFilter, PubSub } from "apollo-server"
import {
  getRoom,
  createRoom,
  findRoom,
  enterRoom,
  startGameInRoom,
} from "../../rooms"

import {
  getUser,
  setUserReady,
} from "../../users"

const pubsub = new PubSub()

const USER_READY = "user_ready"

export default {
  Room: {
    users(
      room : Room
    ) {
      return Promise.all(room.users.map(getUser))
    }
  },
  Query: {
    getRoom: (_ : any, { id }: { id : string }) => (
      findRoom(id)
    ),
  },
  Mutation: {
    createRoom(
      _ : any,
      { name }: { name: string },
      { userId } : ResolverContext,
    ) {
      if (!userId) return null
      return getUser(userId)
        .then((user) => createRoom(name, user))
    },

    async enterRoom(
      _: any,
      { id }: { id: string },
      { userId }: ResolverContext,
    ) {
      if (!userId) return null
      return getUser(userId)
        .then((user) => enterRoom(id, user))
    },

    async setReady(
      _: any,
      { ready }: { ready: boolean },
      { userId, currentRoomId }: ResolverContext,
    ) {
      if (!userId) return null
      if (!currentRoomId) return null

      await setUserReady(userId, ready)
      const room = await getRoom(currentRoomId)
      try {
        const roomWithGame = await startGameInRoom(room.id)

        pubsub.publish(USER_READY, {
          waitForOtherUser: roomWithGame,
        })
        return roomWithGame

      } catch (error) {
        if (
          !(error instanceof Error)
          || (
            error.message !== "Not enough users"
            && error.message !== "Not all users ready"
          )
        ) {
          throw error
        }
      }

      return room
    },
  },
  Subscription: {
    waitForOtherUser: {
      subscribe: withFilter(
        (_parent: any, _variables: any, { currentRoomId }: ResolverContext) => {
          if (!currentRoomId) {
            throw new Error("Not in room")
          }
          return pubsub.asyncIterator(USER_READY)
        },
        (
          payload: { waitForOtherUser: Room },
          _variables: any,
          { currentRoomId }: ResolverContext,
        ) => {
          return payload.waitForOtherUser.id === currentRoomId
        }
      )
    },
  }
}
