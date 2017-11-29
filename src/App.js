import React from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

class App extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewWeapons()
  }

  render() {
    const { data, onSubmit, onLoadMoreWeapons } = this.props
    return (
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
              {data.character.weapons.nodes.map(weapon => (
                <div key={weapon.name}>{weapon.name}</div>
              ))}
              <button type="button" onClick={onLoadMoreWeapons}>
                Load more
              </button>
              <form onSubmit={onSubmit}>
                <input name="weapon" placeholder="Weapon" />
                <button>Add Weapon</button>
              </form>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const withData = graphql(
  gql`
    query character($id: ID!, $weaponsAfter: String) {
      character(id: $id) {
        name
        weapons(first: 2, after: $weaponsAfter) {
          lastCursor
          nodes {
            name
          }
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
    props: ({ data }) => ({
      data,
      // Add a props to be able to subscribe to new weapons
      subscribeToNewWeapons() {
        return data.subscribeToMore({
          document: gql`
            subscription onWeaponAdded($characterId: ID!) {
              weaponAdded(characterId: $characterId) {
                name
              }
            }
          `,
          variables: { characterId: data.variables.id },
          updateQuery: (prev, { subscriptionData: { weaponAdded } }) => {
            if (!weaponAdded) return prev

            // Recursively merge data to add new weapon
            return {
              ...prev,
              character: {
                ...prev.character,
                weapons: {
                  ...prev.character.weapons,
                  nodes: [...prev.character.weapons.nodes, weaponAdded],
                },
              },
            }
          },
        })
      },
      onLoadMoreWeapons() {
        data.fetchMore({
          variables: {
            weaponsAfter: data.character.weapons.lastCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => ({
            ...fetchMoreResult,
            character: {
              ...fetchMoreResult.character,
              weapons: {
                ...fetchMoreResult.character.weapons,
                nodes: [
                  ...previousResult.character.weapons.nodes,
                  ...fetchMoreResult.character.weapons.nodes,
                ],
              },
            },
          }),
        })
      },
    }),
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
      },
    }),
  },
)

export default compose(withData, withMutate)(App)
