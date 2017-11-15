import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const QUERY = gql`
  query character($id: ID!) {
    character(id: $id) {
      name
      films {
        id
        title
      }
    }
  }
`

const App = ({ data }) => (
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
        </div>
      )}
    </div>
  </div>
)

export default graphql(QUERY, { options: { variables: { id: 1 } } })(App)
