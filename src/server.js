import { createServer } from 'http'
import bodyParser from 'body-parser'
import { execute, subscribe } from 'graphql'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import swapi from 'swapi-node'
import DataLoader from 'dataloader'
import express from 'express'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import cors from 'cors'
import { PubSub } from 'graphql-subscriptions'
import schema from './schema'

const app = express()

// Make app accessible from other domains
app.use(cors())

// We create a loader by resource, differents logics
// can exist
const createLoaders = () => ({
  // We make a request for each new data
  // => DataLoader is not very useful
  characters: new DataLoader(async ids =>
    Promise.all(ids.map(async id => swapi.getPerson(id))),
  ),
  // One single request for every ids
  // => DataLoader is very effective!
  films: new DataLoader(async ids => {
    const { results: films } = await swapi.getFilm()
    return ids.map(id => {
      const film = films.find(film => String(film.episode_id) === id)
      return { id, ...film }
    })
  }),
})

const pubsub = new PubSub()

app.use(
  '/graphql',
  bodyParser.json(),
  // We pass options as a function, a new set of options is generated
  // at each new request
  graphqlExpress(req => ({
    schema,
    context: { loaders: createLoaders(), pubsub },
  })),
)

app.get(
  '/',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:3000/subscriptions`,
  }),
)

const server = createServer(app)
server.listen(3000, () => {
  new SubscriptionServer(
    {
      schema,
      execute,
      subscribe,
      onConnect() {
        return { pubsub }
      },
    },
    { server, path: '/subscriptions' },
  )
})
