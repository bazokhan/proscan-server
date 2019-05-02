const path = require('path')
const { fileLoader } = require('merge-graphql-schemas')

module.exports = fileLoader(path.resolve(__dirname, './modules/*/resolvers.js'))
