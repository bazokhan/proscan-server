const user = require('./modules/user-svc/resolvers');
const session = require('./modules/session-svc/resolvers');

const resolvers = {
  Query: {
    ...session.Query
  },
  Mutation: {
    ...user.Mutation,
    ...session.Mutation
  }
};

module.exports = resolvers;
