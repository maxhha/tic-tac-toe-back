import { withFilter, PubSub } from "apollo-server"
import { Room, createRoom, findRoom, enterRoom } from "../../rooms"

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
      { name, userName }: { name: string, userName: string },
    ) {
      return createRoom(name, userName)
    },

    async enterRoom(
      _: any,
      { id, userName }: { id: string, userName: string },
    ) {
      return enterRoom(id, userName).then(
        (room) => {
          pubsub.publish(ADD_USER, { waitForOtherUserEnter: room } )
          return room
        }
      )
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
