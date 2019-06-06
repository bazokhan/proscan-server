const { Prisma } = require('prisma-binding');
const path = require('path');

const prisma = new Prisma({
  typeDefs: path.resolve(__dirname, './generated/prisma.graphql'),
  endpoint: process.env.API_ENDPOINT,
  secret: process.env.API_SECRET
});

const context = context => {
  if (context.connection && context.connection.context) {
    return {
      prisma,
      userID: context.connection.context.userid,
      ...context.connection.context
    };
  } else if (context.req && context.req.headers) {
    return {
      prisma,
      userID: context.req.headers.userid,
      ...context.req.headers
    };
  } else {
    return { prisma };
  }
};

module.exports = context;
