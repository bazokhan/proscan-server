const path = require('path')
const { fileLoader } = require('merge-graphql-schemas')

module.exports = fileLoader(path.join(__dirname, './modules/**/resolvers.js'))
