const { importSchema } = require('graphql-import');
const path = require('path');
const { gql } = require('apollo-server-express');

const prismaSchema = importSchema(
  path.resolve(__dirname, '../', 'generated/prisma.graphql')
);

module.exports = gql(
  importSchema(path.resolve(__dirname, './schema.graphql'), {
    prismaSchema
  })
);
