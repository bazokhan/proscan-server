const { AuthenticationError } = require('apollo-server-express');
const decodeToken = require('./helpers/decodeToken');

const checkToken = async (resolve, root, args, context, info) => {
  const { authorization } = context;
  const operationName = info.operation.selectionSet.selections[0].name.value;
  const skippedOperations = ['login', 'signup'];
  if (authorization && !skippedOperations.includes(operationName)) {
    const token = authorization.replace('Bearer ', '');
    let decoded = null;
    try {
      decoded = decodeToken(token);
    } catch (e) {
      throw new AuthenticationError('Invalid Token');
    }
    if (decoded) {
      const result = await resolve(
        root,
        args,
        { ...context, userID: decoded.id },
        info
      );
      return result;
    }
  }
  const result = await resolve(root, args, context, info);
  return result;
};

module.exports = checkToken;
