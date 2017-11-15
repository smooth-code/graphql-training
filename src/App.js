import React from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

const App = ({ data, onSubmit }) => (
  <div className="app">
    <header>
      <h1>Star Wars React</h1>
    </header>
    <div>
      {data.character && (
        <div>
          <h2>{data.character.name}</h2>
          {data.character.films.map(film => (
            <div key={film.id}>{film.title}</div>
          ))}
          <h2>Weapons</h2>
          {data.character.weapons.map(weapon => (
            <div key={weapon.name}>{weapon.name}</div>
          ))}
          <form onSubmit={onSubmit}>
            <input name="weapon" placeholder="Weapon" />
            <button>Add Weapon</button>
          </form>
        </div>
      )}
    </div>
  </div>
)

const withData = graphql(
  gql`
    query character($id: ID!) {
      character(id: $id) {
        name
        weapons {
          name
        }
        films {
          id
          title
        }
      }
    }
  `,
  {
    options: { variables: { id: 1 } },
  },
)

const withMutate = graphql(
  gql`
    mutation addCharacterWeapon($characterId: ID!, $weapon: WeaponInput!) {
      addCharacterWeapon(characterId: $characterId, weapon: $weapon) {
        name
      }
    }
  `,
  {
    props: ({ mutate, ownProps: { data } }) => ({
      async onSubmit(event) {
        event.preventDefault()
        await mutate({
          variables: {
            characterId: data.variables.id,
            weapon: {
              name: event.target.weapon.value,
            },
          },
        })
        data.refetch()
      },
    }),
  },
)

export default compose(withData, withMutate)(App)
