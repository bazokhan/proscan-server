const resolvers = {
  Query: {
    async sessions(parent, args, {prisma}, info) {
      return null
    },

    async session(parent, args, {prisma}, info) {
      return null
    }
  },

  Mutation: {
    async createSession(parent, args, {prisma}, info) {
      return null
    },

    async updateSession(parent, args, {prisma}, info) {
      return null
    },

    async deleteSession(parent, args, {prisma}, info) {
      return null
    }
  }
}

module.exports = resolvers
