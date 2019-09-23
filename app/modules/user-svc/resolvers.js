module.exports = {
  Query: {
    users: async (_, args, { prisma }, info) => {
      const users = await prisma.query.users(info);
      return users.map(user => {
        user.sessions = prisma.query.sessions({
          where: {
            author: {
              id: user.id
            }
          }
        });
        return user;
      });
    },
    profile: async (_, args, { prisma, userID }, info) => {
      const profile = await prisma.query.user({ where: { id: userID }, info });
      profile.sessions = await prisma.query.sessions({
        where: {
          author: {
            id: userID
          }
        }
      });
      return profile;
    }
  },
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
