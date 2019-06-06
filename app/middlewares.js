const { applyMiddleware } = require('graphql-middleware');
const userMid = require('./modules/user-svc/middlewares');
const middlewares = [...userMid];

const addMiddlewares = schema => {
  middlewares.forEach(middleware => {
    schema = applyMiddleware(schema, middleware);
  });
  return schema;
};

module.exports = addMiddlewares;
