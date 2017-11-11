import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'

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
addMockFunctionsToSchema({ schema })

const query = /* GraphQL */ `
  {
    character(id: 6) {
      id
      name
      height
      gender
    }
  }
`

graphql(schema, query).then(result => {
  console.log('Query result:\n', result)
})
