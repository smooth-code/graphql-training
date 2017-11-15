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
    weapons(first: Int!, after: String): WeaponResults
    films: [Film]!
  }

  type Human implements Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    gender: Gender
    weapons(first: Int!, after: String): WeaponResults
    films: [Film]!
  }

  type Droid implements Character {
    id: ID!
    created: DateTime!
    name: String!
    height: Int
    weapons(first: Int!, after: String): WeaponResults
    films: [Film]!
  }

  type Weapon {
    name: String!
  }

  type WeaponResults {
    lastCursor: String!
    nodes: [Weapon!]!
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

const characterWeapons = {
  1: [
    { name: 'Red Light Saber' },
    { name: 'Blue Light Saber' },
    { name: 'Laser Gun' },
    { name: 'Knife' },
  ],
}

const CURSOR_SECRET = 'SMOOTH'
const btoa = str => Buffer.from(str).toString('base64')
const atob = str => Buffer.from(str, 'base64').toString('utf-8')
const indexToCursor = index => btoa(`${CURSOR_SECRET}${index}`)
const cursorToIndex = cursor => Number(atob(cursor).replace(CURSOR_SECRET, ''))

// Shared resolver between Droid and Human
const CharacterResolver = {
  films(character, variables, { loaders }) {
    return character.films.map(async url => {
      const [, id] = url.match(/\/(\d)+\/$/)
      return loaders.films.load(id)
    })
  },
  weapons(character, { first, after }) {
    const { weapons } = character
    const afterIndex = after ? cursorToIndex(after) : -1
    const firstIndex = afterIndex + 1
    const lastIndex = afterIndex + first
    return {
      lastCursor: indexToCursor(lastIndex),
      nodes: weapons.slice(firstIndex, lastIndex + 1),
    }
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
