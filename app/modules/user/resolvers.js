const resolvers = {
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
