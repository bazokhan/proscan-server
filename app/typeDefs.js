const path = require('path')
const { fileLoader, mergeTypes } = require('merge-graphql-schemas')

const typesArray = fileLoader(path.resolve(__dirname, './modules/*/schema.graphql'))
module.exports = mergeTypes(typesArray)
