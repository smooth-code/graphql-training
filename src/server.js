import { makeExecutableSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import swapi from 'swapi-node'

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

const resolvers = {
  Query: {
    async character(root, { id }) {
      const person = await swapi.getPerson(id)
      return { ...person, id, gender: person.gender.toUpperCase() }
    },
  },
  Character: {
    __resolveType(obj, context, info) {
      if (obj.gender !== 'n/a') return 'Human'
      return 'Droid'
    },
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

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

graphql(schema, query, null, null, { id: 1 }).then(result => {
  console.log('Query result:\n', result)
})
