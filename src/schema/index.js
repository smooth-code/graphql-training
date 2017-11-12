import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'
import DateTime, { resolvers as dateTimeResolvers } from './DateTime'
import Character, { resolvers as characterResolvers } from './Character'

const SchemaDefinition = /* GraphQL */ `
  schema {
    query: Query
    mutation: Mutation
  }
`

const Query = /* GraphQL */ `
  type Query {
    aNumber: Int
  }
`

const Mutation = /* GraphQL */ `
  type Mutation {
    aNumber: Int
  }
`

const rootResolvers = {}

const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, Query, Mutation, ...DateTime, ...Character],
  resolvers: merge({}, rootResolvers, dateTimeResolvers, characterResolvers),
})

export default schema