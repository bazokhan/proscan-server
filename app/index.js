const { GraphQLServer } = require('graphql-yoga')
const context = require('./context')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const server = new GraphQLServer({
  typeDefs,
  context,
  resolvers
})

const app = server.express
app.get('/health', (req, res) => {
  console.log('Request Got !')
  res.sendStatus(200)
})

const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development'

server.start({ port }, () => {
  console.log(`the ${env} server is up on  http://localhost:3003`)
  console.log(`Press CTRL + C To Exit..`)
}).catch(err => console.error('connection Error', err))
