const { applyMiddleware } = require('graphql-middleware');

const userMid = require('./modules/user-svc/middlewares');
const sessionMid = require('./modules/session-svc/middlewares');
const checkToken = require('./globalMiddlewares/checkToken');

const middlewares = [...userMid, ...sessionMid, checkToken];

const addMiddlewares = schema => {
  middlewares.forEach(middleware => {
    schema = applyMiddleware(schema, middleware);
  });
  return schema;
};

module.exports = addMiddlewares;
