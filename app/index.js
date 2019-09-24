const server = require('./server');

server.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT || 'port'}/graphql , env: ${
      process.env.NODE_ENV
    }`
  )
);
