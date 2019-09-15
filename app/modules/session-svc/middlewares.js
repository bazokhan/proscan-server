const createQuestion = {
  Mutation: {
    createQuestions: async (resolve, root, args, context, info) => {
      const { prisma, userID } = context;
      const { publicId } = args;
      let activeQuestion = null;
      let questions = null;
      const { data } = args;

      if (data && data.length) {
        questions = await data.reduce(
          async (prev, { id, body, imageUrls, choices }) => {
            prev = await prev;
            if (imageUrls) {
              imageUrls = imageUrls.reduce(
                (pre, next) => {
                  pre.set.push(next);
                  return pre;
                },
                { set: [] }
              );
            }
            if (choices) {
              choices = choices.reduce(
                (pre, next) => {
                  if (next.id) {
                    const { id, ...choice } = next;
                    pre.update = pre.update || [];
                    pre.update.push({
                      where: { id },
                      data: choice
                    });
                    return pre;
                  }
                  pre.create.push(next);
                  return pre;
                },
                { create: [] }
              );
            }
            if (id) {
              await prisma.mutation.updateQuestion({
                data: {
                  body,
                  imageUrls,
                  choices
                },
                where: { id }
              });
              return prev;
            }
            const question = await prisma.mutation.createQuestion({
              data: {
                author: {
                  connect: {
                    id: userID
                  }
                },
                body,
                imageUrls,
                choices
              }
            });
            prev.push({ id: question.id });
            return prev;
          },
          []
        );
      }

      const prevQuestions = await prisma.query.questions(
        {
          where: {
            session: {
              publicId
            }
          }
        },
        `{
        id
      }`
      );

      if (!prevQuestions || !prevQuestions.length) {
        activeQuestion = questions[0].id;
        return resolve(
          root,
          { ...args, questions, activeQuestion },
          context,
          info
        );
      }
      return resolve(root, { ...args, questions }, context, info);
    }
  }
};

const nextQuestion = {
  Mutation: {
    nextQuestion: async (resolve, root, args, context, info) => {
      try {
        const { publicId } = args;
        const { prisma, userID } = context;
        const session = await prisma.query.session(
          {
            where: {
              publicId
            }
          },
          `{
          questions {
            id
          }
          author {
            id
          }
          activeQuestion      
        }`
        );

        if (!userID || !session || session.author.id !== userID) {
          throw new Error("You don't have access to do that");
        }
        const { activeQuestion, questions } = session;
        const index = questions.findIndex(({ id }) => activeQuestion === id);
        if (index === questions.length - 1) {
          return resolve(
            root,
            { ...args, questionID: questions[0].id },
            context,
            info
          );
        }
        return resolve(
          root,
          { ...args, questionID: questions[index + 1].id },
          context,
          info
        );
      } catch (ex) {
        console.log(ex);
      }
    }
  }
};

module.exports = [createQuestion, nextQuestion];
