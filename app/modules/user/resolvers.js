const bcrypt = require('bcryptjs');
const salt = 10;

const resolvers = {
  Query: {
    async users(parent, args, { prisma }, info) {
      const queryArgs = {};
      return prisma.query.users(queryArgs, info);
    }
  },
  Mutation: {
    async register(parent, { data }, { prisma }, info) {
      if (data.password.length < 6) {
        throw new Error('Password must be 6 characters or more.');
      }
      const password = await bcrypt.hash(data.password, salt);
      const userCreateInput = {
        ...data,
        password
      };
      console.log({ password, userCreateInput });
      return prisma.mutation.createUser({ data: userCreateInput }, info);
    },

    async login(parent, { password }, { prisma }, info) {
      return null;
    }
  }
};

module.exports = resolvers;
