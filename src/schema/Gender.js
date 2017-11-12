import { makeExecutableSchema } from 'graphql-tools'

const Gender = /* GraphQL */ `
  enum Gender {
    MALE
    FEMALE
    UNKNOWN
  }
`

export default [Gender]
