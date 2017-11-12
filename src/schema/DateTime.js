import { makeExecutableSchema } from 'graphql-tools'
import { GraphQLDateTime } from 'graphql-iso-date'

const DateTime = /* GraphQL */ `
  scalar DateTime
`

export const resolvers = {
  DateTime: GraphQLDateTime,
}

export default [DateTime]
