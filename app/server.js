const express = require('express');
const { createServer } = require('http');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const cors = require('cors');
const bodyParser = require('body-parser');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const context = require('./context');
const applyMiddlewares = require('./middlewares');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const schemaWithMiddlewares = applyMiddlewares(schema);

const server = new ApolloServer({
  schema: schemaWithMiddlewares,
  context,
  introspection: true,
  playground: true,
  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
    maxFileSize: 1000000000, // 100 MB
    maxFiles: 20
  }
});

const app = express();

const whitelist = [
  'http://localhost:4000',
  'http://localhost:3000',
  'http://localhost:3002',
  'http://quiz.manalclassroom.com/',
  'https://proscan-client.herokuapp.com',
  'https://proscan-server.herokuapp.com/graphql'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  })
);

app.use(bodyParser.json());

app.get('/health', (req, res) => {
  console.log('Request Got !');
  res.sendStatus(200);
});

server.applyMiddleware({ app });
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

module.exports = httpServer;
