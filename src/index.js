const express = require('express')
const bodyParser = require('body-parser')
// will handle GraphQL server reqs and res based on schema
// use GraphiQL for playground
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const schema = require('./schema')
const connectMongo = require('./mongo-connector')
const { authenticate } = require('./authentication')

const start = async () => {
  const mongo = await connectMongo()
  var app = express()
  const buildOptions = async (req, res) => {
    const user = await authenticate(req, mongo.Users)
    return {
      context: { mongo, user },
      schema
    }
  }

  // put mongodb collections into context object
  // context object is passed to all resolvers
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions))

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-foo@bar.com'`
  }))

  const PORT = 3000

  app.listen(PORT, () => {
    console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  })
}

start()

