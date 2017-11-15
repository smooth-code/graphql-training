import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import swapi from 'swapi-node'
import DataLoader from 'dataloader'
import express from 'express'
import schema from './schema'

const app = express()

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

app.use(
  '/graphql',
  bodyParser.json(),
  // We pass options as a function, a new set of options is generated
  // at each new request
  graphqlExpress(req => ({ schema, context: { loaders: createLoaders() } })),
)

app.get('/', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(3000)
