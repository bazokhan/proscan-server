const { encryptPass, comparePass } = require('./helpers/passActions');
const genToken = require('./helpers/genToken');

const signupMiddleware = {
  Mutation: {
    signup: async (resolve, root, args, context, info) => {
      const { prisma } = context;
      const { email, password } = args.data;
      let user = await prisma.query.user({
        where: {
          email
        }
      });
      if (user && user.id) {
        throw new Error('User already Exists');
      }

      args.data.password = await encryptPass(password);

      user = await resolve(root, args, context);

      const token = genToken({ id: user.id, email });
      return {
        token
      };
    }
  }
};

const loginMiddleware = {
  Mutation: {
    login: async (resolve, root, args, context, info) => {
      const { prisma } = context;
      const { email, password } = args;
      let user = await prisma.query.user({
        where: {
          email
        }
      });
      if (user && user.id) {
        const match = await comparePass({
          password,
          hashedPassword: user.password
        });
        if (match) {
          const token = genToken({ id: user.id, email: email });
          return resolve(root, { ...args, token }, context, info);
        }
      }
      throw new Error('invalid email or password');
    }
  }
};

module.exports = [signupMiddleware, loginMiddleware];
