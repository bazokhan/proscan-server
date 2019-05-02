const { Prisma } = require('prisma-binding')

const prisma = new Prisma({
  typeDefs: 'server/prisma_generated/schema.graphql',
  endpoint: process.env.API_ENDPOINT
})
