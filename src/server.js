import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import swapi from 'swapi-node'
import express from 'express'
import schema from './schema'

const app = express()

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
app.get('/', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(3000)
