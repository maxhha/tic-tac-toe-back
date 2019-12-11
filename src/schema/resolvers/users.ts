import { createToken } from "../../utils"
import {
  createUser,
  findUser,
} from "../../users"

export default {
  Query: {
    viewer(
      _parent: any,
      _variables: any,
      { userId }: ResolverContext,
    ) {
      if (!userId) return null
      return findUser(userId)
    },
  },
  Mutation: {
    async createUser(
      _: any,
      { input: { name } } : { input: { name: string } },
    ) {
      return createUser(name)
        .then((user) => {
          return createToken({ uid: user.id })
        })
    }
  },
}
