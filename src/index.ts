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

app.use(express.static('front'))

// Setup GraphQL server
const server = new ApolloServer({
  schema,
  context: ({
    req,
    payload,
  }: {
    req?: express.Request,
    payload?: {
      authorization?: string,
    },
  }) => {// yey undefined framework properties mmmm... like it (no)
    if (!req) {
      return payload ? getContext(payload.authorization || '') : {}
    } else {
      return getContext(req.headers.authorization || '')
    }
  },
})
server.applyMiddleware({ app })

// Setup http server with ws subsciptions
const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
