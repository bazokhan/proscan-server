const user = require('./modules/user-svc/resolvers');

const resolvers = {
  Query: {
    hello: () => 'Hello World'
  },
  Mutation: {
    ...user.Mutation
  }
};

module.exports = resolvers;
