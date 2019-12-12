require('dotenv').config()

import express from "express"
import { createServer } from "http"
import { ApolloServer } from 'apollo-server-express'
import schema from "./schema"
import { verifyToken } from "./utils"
import { getUser } from "./users"

const getContext = async (token: string) => {
  const data = verifyToken(token)
  let context : ResolverContext = {}

  if (data) {
    context = await (
      getUser(data.uid)
      .then(
        user => ({
          userId: user.id,
          currentRoomId: user.currentRoomId
        }),
        _err => ({}),
      )
    )
  }

  return context
}

const app: express.Application = express()

// Setup GraphQL server
const server = new ApolloServer({
  schema,
  context: ({ req, connection }) => {
    if (!req) {
      return connection ? connection.context : {}
    } else {
      return getContext(req.headers.authorization || '')
    }
  },
  subscriptions: {
    onConnect(
      { authorization } : { authorization?: string }
    ) {
      return getContext(authorization || '')
    },
    onDisconnect: () => {

    },
  },
})
server.applyMiddleware({ app })

// Setup http server with ws subsciptions
const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
