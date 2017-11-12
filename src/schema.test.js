import { graphql } from 'graphql'
import schema from './schema'

describe('GraphQL schema', () => {
  describe('Query: character', () => {
    it('should show a character', async () => {
      const query = /* GraphQL */ `
        {
          character(id: 5) {
            name
            created
            ... on Human {
              gender
            }
          }
        }
      `

      const swapi = {
        async getPerson() {
          return {
            name: 'James',
            created: new Date('2017-05-21'),
            gender: 'male',
          }
        },
      }

      const result = await graphql(schema, query, null, { swapi })
      expect(result.data).toEqual({
        character: {
          name: 'James',
          created: '2017-05-21T00:00:00.000Z',
          gender: 'MALE',
        },
      })
    })
  })
})
