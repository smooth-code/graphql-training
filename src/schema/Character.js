import { makeExecutableSchema } from 'graphql-tools'
import Gender from './Gender'

const Character = /* GraphQL */ `
  interface Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    weapons: [Weapon]!
  }

  type Human implements Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    gender: Gender
    weapons: [Weapon]!
  }

  type Droid implements Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    weapons: [Weapon]!
  }

  type Weapon {
    name: String!
  }

  input WeaponInput {
    name: String!
  }

  extend type Query {
    character(id: ID!): Character
  }

  extend type Mutation {
    addCharacterWeapon(characterId: ID!, weapon: WeaponInput): Weapon
  }
`

const characterWeapons = {}

export const resolvers = {
  Query: {
    async character(root, { id }, { swapi }) {
      const person = await swapi.getPerson(id)
      return {
        ...person,
        id,
        gender: person.gender.toUpperCase(),
        weapons: characterWeapons[id] || [],
      }
    },
  },
  Mutation: {
    async addCharacterWeapon(root, { characterId, weapon }, { swapi }) {
      characterWeapons[characterId] = characterWeapons[characterId] || []
      characterWeapons[characterId].push(weapon)
      return weapon
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
