const { addFragmentToInfo } = require('graphql-binding');
const resolvers = {
  Query: {
    sessionByID: async (_, { publicId }, { prisma, guestID, userID }, info) => {
      const newInfo = addFragmentToInfo(
        info,
        `fragment SessionFragment on Session {
          author {
            id
          }
          guests {
            id
          }
        }`
      );
      const session = await prisma.query.session(
        {
          where: { publicId }
        },
        newInfo
      );
      if (
        session &&
        (session.guests.find(({ id }) => id === guestID) ||
          session.author.id === userID)
      ) {
        return session;
      }
      return null;
    },
    userSessions: (_, args, { prisma, userID }, info) => {
      return prisma.query.sessions(
        {
          where: {
            author: {
              id: userID
            }
          }
        },
        info
      );
    },
    alreadyJoined: async (_, { publicId }, { prisma, guestID }, info) => {
      let joined = false;
      if (guestID) {
        const session = await prisma.query.session(
          {
            where: { publicId }
          },
          `{
          id
          guests {
            id
            username
          }
        }`
        );
        if (session) {
          joined = session.guests.map(({ id }) => id).includes(guestID);
        }
      }
      return joined;
    }
  },
  Mutation: {
    createSession: (_, { publicId }, { prisma, userID }, info) => {
      return prisma.mutation.createSession(
        {
          data: {
            publicId,
            author: {
              connect: {
                id: userID
              }
            }
          }
        },
        info
      );
    },
    createQuestions: (
      _,
      { publicId, questions, activeQuestion },
      { prisma },
      info
    ) => {
      return prisma.mutation.updateSession(
        {
          where: {
            publicId
          },
          data: {
            questions: {
              connect: questions
            },
            activeQuestion
          }
        },
        info
      );
    },
    nextQuestion: (_, { questionID, publicId }, { prisma }, info) => {
      return prisma.mutation.updateSession(
        {
          where: {
            publicId
          },
          data: {
            activeQuestion: questionID
          }
        },
        info
      );
    },
    joinSession: async (
      _,
      { publicId, username },
      { prisma, guestID },
      info
    ) => {
      if (guestID) {
        const guest = await prisma.query.guest(
          { where: { id: guestID } },
          `{
            id
            session {
              publicId
            }
          }`
        );
        if (guest && guest.session.publicId === publicId) {
          throw new Error('You are already Joined');
        }

        if (guest) {
          return await prisma.mutation.updateGuest(
            {
              where: {
                guestID
              },
              data: {
                session: {
                  connect: {
                    publicId
                  }
                }
              }
            },
            info
          );
        }
      }

      return prisma.mutation.createGuest(
        {
          data: {
            username,
            session: {
              connect: {
                publicId
              }
            }
          }
        },
        info
      );
    }
  }
};

module.exports = resolvers;
