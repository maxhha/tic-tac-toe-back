import { GraphQLScalarType, ValueNode } from "graphql"
import { Kind } from 'graphql/language'

export default {
  Token: new GraphQLScalarType({
    name: "Token",
    serialize: (val: any) => val,
    parseValue: (val: any) => val,
    parseLiteral: (ast: ValueNode) => {
      if (ast.kind === Kind.STRING) {
        return ast.value
      }
      return null
    }
  })
}
