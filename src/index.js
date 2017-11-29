import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import App from './App'

// Create HTTP Link
const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' })

// Create WS Link
const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000/subscriptions`,
  options: { reconnect: true },
})

const link = split(
  // Split based on operation type
  // subscription => wsLink
  // query, mutation => httpLink
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  // Link define the way of fetching data
  link,
  // Cache defines the cache implementation to use
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)
