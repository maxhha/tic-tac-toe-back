import { createServer } from "http"
import express from "express"
import { ApolloServer } from 'apollo-server-express'
import schema from "./schema"

const app: express.Application = express()

// Setup GraphQL server
const server = new ApolloServer({ schema })
server.applyMiddleware({ app })

// Setup http server with ws subsciptions
const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
