module.exports = {
  Mutation: {
    signup: (_, { data: { email, password, username } }, { prisma }) => {
      return prisma.mutation.createUser({
        data: {
          username,
          email,
          password
        }
      });
    },
    login: (_, { token }) => {
      return {
        token
      };
    }
  }
};
