import path from 'path'
import { makeExecutableSchema } from 'graphql-tools';
import {
  fileLoader,
  mergeResolvers,
  mergeTypes,
} from 'merge-graphql-schemas'

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, "./types"), { recursive: true })
)

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"), { recursive: true })
)

export default makeExecutableSchema({ typeDefs, resolvers })
