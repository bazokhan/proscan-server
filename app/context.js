const path = require('path')
const { Prisma } = require('prisma-binding')
const { PubSub } = require('graphql-yoga')

const prisma = new Prisma({
  typeDefs: path.resolve(__dirname, '../generated/prisma.graphql'),
  endpoint: process.env.API_ENDPOINT,
  secret: process.env.API_SECRET
})

const pubsub = new PubSub()

module.exports = {
  prisma,
  pubsub
}
