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
        () => pubsub.asyncIterator(ADD_USER),
        (
          payload: { waitForOtherUserEnter: Room, userId: string },
          _variables: any,
          { userId }: ResolverContext,
        ) => {
          return payload.waitForOtherUserEnter.users.findIndex(
            ({ id }) => id === userId
          ) >= 0
        }
      )
    },
  }
}
