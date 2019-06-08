const resolvers = {
  Query: {
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
