require('dotenv').config()

import express from "express"
import { createServer } from "http"
import { ApolloServer } from 'apollo-server-express'
import schema from "./schema"
import { verifyToken } from "./utils"

const app: express.Application = express()

// Setup GraphQL server
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
   if (!req) return {}
   const token = req.headers.authorization || '';

   const data = verifyToken(token)
   const context : ResolverContext = {}

   if (data) {
     context.userId = data.uid
   }

   return context
 },
  subscriptions: {
    onConnect: (connectionParams, _websocket, context) => {
      console.log("connected at ")
      console.dir(connectionParams)
      console.dir(context)
    },
    onDisconnect: () => {

    }
  }
})
server.applyMiddleware({ app })

// Setup http server with ws subsciptions
const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
