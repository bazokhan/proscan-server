const path = require('path')
const { Prisma } = require('prisma-binding')

const prisma = new Prisma({
  typeDefs: path.resolve(__dirname, '../generated/prisma.graphql'),
  endpoint: process.env.API_ENDPOINT
})

module.exports = {
  prisma
}
