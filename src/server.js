import { makeExecutableSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import swapi from 'swapi-node'
import express from 'express'

const typeDefs = /* GraphQL */ `
  scalar DateTime

  enum Gender {
    MALE
    FEMALE
    UNKNOWN
  }

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

  type Query {
    character(id: ID!): Character
  }
`

const resolvers = {
  DateTime: GraphQLDateTime,
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
      created
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

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)
