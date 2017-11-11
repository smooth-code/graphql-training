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
  query Character($id: ID!){
    character(id: $id) {
      id
      name
      height
      gender
    }
  }
`

graphql(schema, query, null, null, { id: 6 }).then(result => {
  console.log('Query result:\n', result)
})
