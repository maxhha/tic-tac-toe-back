import { PubSub } from 'apollo-server'

const dataPubsub = new PubSub()
const data : String[] = []

const ADD_DATA = "add_data"

export default {
  Query: {
    hello: () => "world of: " + data.join(","),
    test: (_ : any, args : { name : String }) => `what do you want, Mr ${args.name}??`,
    age: () => "11",
  },
  Mutation: {
    push: (_ : any, args: { data : string }) => {
      const result = data.push(args.data)
      dataPubsub.publish(ADD_DATA, { dataAdded: args.data })
      return result
    },
  },
  Subscription: {
    dataAdded: {
      subscribe: (_: any, b:any) => Boolean(console.log("sub:",b)) || dataPubsub.asyncIterator(ADD_DATA),
    },
  },
}
