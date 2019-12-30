import { withFilter, PubSub } from "apollo-server"
import {
  createRoom,
  findRoom,
  enterRoom,
} from "../../rooms"
import {
  getUser,
} from "../../users"

const pubsub = new PubSub()

const ADD_USER = "add_user"

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
        .then((room) => {
          pubsub.publish(ADD_USER, { waitForOtherUserEnter: room } )
          return room
        })
    },
  },
  Subscription: {
    waitForOtherUserEnter: {
      subscribe: withFilter(
        (_parent: any, _variables: any, { currentRoomId }: ResolverContext) => {
          if (!currentRoomId) {
            throw new Error("Not in room")
          }
          return pubsub.asyncIterator(ADD_USER)
        },
        (
          payload: { waitForOtherUserEnter: Room },
          _variables: any,
          { currentRoomId }: ResolverContext,
        ) => {
          return payload.waitForOtherUserEnter.id === currentRoomId
        }
      )
    },
  }
}
