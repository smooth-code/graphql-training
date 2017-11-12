import { makeExecutableSchema } from 'graphql-tools'
import swapi from 'swapi-node'
import Gender from './Gender'

const Character = /* GraphQL */ `
  interface Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
  }

  type Human implements Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    gender: Gender
  }

  type Droid implements Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
  }

  extend type Query {
    character(id: ID!): Character
  }
`

export const resolvers = {
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

export default [...Gender, Character]
