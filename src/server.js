import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'

const typeDefs = /* GraphQL */ `
  enum Gender {
    MALE
    FEMALE
    UNKNOWN
  }

  type Character {
    id: ID!
    name: String!
    height: Int
    gender: Gender
  }

  type Query {
    character(id: ID!): Character
  }
`

const schema = makeExecutableSchema({ typeDefs })
