const resolvers = {
  Query: {
    async users(parent, args, { prisma }, info) {
      const queryArgs = {}
      return prisma.query.users(queryArgs, info)
    }
  },
  Mutation: {
    async register(parent, { password, ...args }, { prisma }, info) {
      return null
    },

    async login(parent, { password }, { prisma }, info) {
      return null
    }
  }
}

module.exports = resolvers
