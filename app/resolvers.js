const user = require('./modules/user-svc/resolvers');
const session = require('./modules/session-svc/resolvers');
const upload = require('./modules/upload-svc/resolvers');

const resolvers = {
  Query: {
    ...session.Query,
    ...upload.Query
  },
  Mutation: {
    ...user.Mutation,
    ...session.Mutation,
    ...upload.Mutation
  },
  Subscription: {
    ...session.Subscription
  }
};

module.exports = resolvers;
