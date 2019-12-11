import { withFilter, PubSub } from "apollo-server"
import { Room, createRoom, findRoom, enterRoom } from "../../rooms"
import { findUser } from "../../users"

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
      return findUser(userId)
        .then((user) => user ? createRoom(name, user) : null)
    },

    async enterRoom(
      _: any,
      { id }: { id: string },
    ) {
      return null
      // return enterRoom(id, userName).then(
      //   (room) => {
      //     pubsub.publish(ADD_USER, { waitForOtherUserEnter: room } )
      //     return room
      //   }
      // )
    },
  },
  Subscription: {
    waitForOtherUserEnter: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ADD_USER),
        (
          payload : { waitForOtherUserEnter: Room },
          { id } : { id: string },
        ) => {
          return payload.waitForOtherUserEnter.id === id
        }
      )
    },
  }
}
