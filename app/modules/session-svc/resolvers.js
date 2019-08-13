const { addFragmentToInfo } = require('graphql-binding');
const {
  sessionFragment,
  sessionInfo
} = require('../fragments/SessionFragment');
const {
  questionFragment,
  questionInfo
} = require('../fragments/QuestionFragment');
const resolvers = {
  Query: {
    sessionByID: async (_, { publicId }, { prisma, guestID, userID }, info) => {
      const newInfo = addFragmentToInfo(info, sessionFragment);
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
    nextQuestion: async (
      _,
      { questionID, publicId },
      { prisma, pubsub },
      info
    ) => {
      const newInfo = addFragmentToInfo(info, sessionFragment);

      const result = await prisma.mutation.updateSession(
        {
          where: {
            publicId
          },
          data: {
            activeQuestion: questionID
          }
        },
        newInfo
      );
      pubsub.publish(`Session_${publicId}_ActiveQuestion`, {
        mutation: 'NextQuestion',
        publicId,
        session: result
      });

      return result;
    },
    joinSession: async (
      _,
      { publicId, username },
      { prisma, guestID, pubsub },
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
          const result = await prisma.mutation.updateGuest(
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
          const session = await prisma.query.session(
            {
              where: {
                publicId
              }
            },
            sessionInfo
          );
          pubsub.publish(`Session_${publicId}_NewGuest`, {
            mutation: 'JoinSession',
            publicId,
            session
          });
          return result;
        }
      }

      const result = await prisma.mutation.createGuest(
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
      const session = await prisma.query.session(
        {
          where: {
            publicId
          }
        },
        sessionInfo
      );

      pubsub.publish(`Session_${publicId}_NewGuest`, {
        mutation: 'JoinSession',
        publicId,
        session
      });

      return result;
    },
    changeSessionStatus: async (
      _,
      { status, publicId },
      { prisma, userID, pubsub },
      info
    ) => {
      const session = await prisma.query.sessions(
        {
          where: {
            publicId,
            author: {
              id: userID
            }
          }
        },
        `{id}`
      );
      if (!session || !session.length) {
        throw new Error('Session does not exist');
      }

      const result = await prisma.mutation.updateSession(
        {
          where: {
            publicId
          },
          data: {
            status
          }
        },
        info
      );
      pubsub.publish('Session_Status_Updated', {
        publicId,
        status,
        session: result
      });

      return result;
    },
    answerQuestion: async (
      _,
      { questionID, chooseID },
      { prisma, guestID, pubsub },
      info
    ) => {
      const choice = await prisma.query.choice(
        {
          where: {
            id: chooseID
          }
        },
        `{
        id
        body
        chosenBy
        correct
      }`
      );
      if (choice) {
        const choosers = choice.chosenBy || [];
        choosers.push(guestID);
        await prisma.mutation.updateChoice({
          where: {
            id: chooseID
          },
          data: {
            chosenBy: {
              set: choosers
            }
          }
        });
        const newInfo = addFragmentToInfo(info, questionFragment);

        const question = await prisma.query.question(
          {
            where: {
              id: questionID
            }
          },
          newInfo
        );

        pubsub.publish(`Question_${questionID}_Updated`, {
          questionID,
          question
        });

        return question;
      }
      return null;
    }
  },
  Subscription: {
    subToSessions: {
      resolve: payload => {
        return payload;
      },
      subscribe: (_, args, { pubsub }) =>
        pubsub.asyncIterator('Session_Status_Updated')
    },
    subToQuestion: {
      resolve: payload => {
        return payload;
      },
      subscribe: (_, { questionID }, { pubsub }) =>
        pubsub.asyncIterator(`Question_${questionID}_Updated`)
    },
    subToSession: {
      resolve: payload => {
        return payload;
      },
      subscribe: (_, { publicId }, { pubsub }) =>
        pubsub.asyncIterator([
          `Session_${publicId}_ActiveQuestion`,
          `Session_${publicId}_NewGuest`
        ])
    }
  }
};

module.exports = resolvers;
