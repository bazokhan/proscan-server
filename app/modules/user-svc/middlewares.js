const encryptPass = require('./helpers/encryptPass');
const genToken = require('./helpers/genToken');

const signupMiddleware = {
  Mutation: {
    signup: async (resolve, root, args, context, info) => {
      const { prisma } = context;
      let user = await prisma.query.user({
        where: {
          email: args.data.email
        }
      });
      if (user && user.id) {
        throw new Error('User already Exists');
      }

      args.data.password = await encryptPass(args.data.password);

      user = await resolve(root, args, context);

      const token = genToken({ id: user.id, email: args.data.email });
      return {
        token
      };
    }
  }
};

module.exports = [signupMiddleware];
