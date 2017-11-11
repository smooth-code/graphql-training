import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'

const typeDefs = /* GraphQL */ `
  enum Gender {
    MALE
    FEMALE
    UNKNOWN
  }

  interface Character {
    id: ID!
    name: String!
    height: Int
  }

  type Human implements Character {
    id: ID!
    name: String!
    height: Int
    gender: Gender
  }

  type Droid implements Character {
    id: ID!
    name: String!
    height: Int
  }

  type Query {
    character(id: ID!): Character
  }
`

const schema = makeExecutableSchema({ typeDefs })
addMockFunctionsToSchema({ schema })

const query = /* GraphQL */ `
  query Character($id: ID!){
    character(id: $id) {
      id
      name
      height
      ... on Human {
        gender
      }
    }
  }
`

graphql(schema, query, null, null, { id: 6 }).then(result => {
  console.log('Query result:\n', result)
})
