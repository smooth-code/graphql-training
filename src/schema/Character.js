import { makeExecutableSchema } from 'graphql-tools'
import Gender from './Gender'

const Character = /* GraphQL */ `
  type Film {
    id: ID!
    title: String!
  }

  interface Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    weapons: [Weapon]!
    films: [Film]!
  }

  type Human implements Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    gender: Gender
    weapons: [Weapon]!
    films: [Film]!
  }

  type Droid implements Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    weapons: [Weapon]!
    films: [Film]!
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

// Shared resolver between Droid and Human
const CharacterResolver = {
  films(character, variables, { loaders }) {
    return character.films.map(async url => {
      const [, id] = url.match(/\/(\d)+\/$/)
      return loaders.films.load(id)
    })
  },
}

export const resolvers = {
  Query: {
    async character(root, { id }, { loaders }) {
      // We use DataLoader passed in context
      const person = await loaders.characters.load(id)
      return {
        ...person,
        id,
        gender: person.gender.toUpperCase(),
        weapons: characterWeapons[id] || [],
      }
    },
  },
  Mutation: {
    async addCharacterWeapon(root, { characterId, weapon }) {
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
  Human: {
    ...CharacterResolver,
  },
  Droid: {
    ...CharacterResolver,
  },
}

export default [...Gender, Character]
