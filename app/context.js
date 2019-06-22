const { Prisma } = require('prisma-binding');
const path = require('path');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();
const prisma = new Prisma({
  typeDefs: path.resolve(__dirname, './generated/prisma.graphql'),
  endpoint: process.env.API_ENDPOINT,
  secret: process.env.API_SECRET
});

const context = context => {
  if (context.connection && context.connection.context) {
    return {
      prisma,
      pubsub,
      guestID: context.connection.context.guestid,
      ...context.connection.context
    };
  } else if (context.req && context.req.headers) {
    return {
      prisma,
      pubsub,
      guestID: context.req.headers.guestid,
      ...context.req.headers
    };
  } else {
    return { prisma, pubsub };
  }
};

module.exports = context;
