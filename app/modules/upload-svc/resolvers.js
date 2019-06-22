const axios = require('axios')
const cloudinary = require('cloudinary')
const { GraphQLUpload } = require('graphql-upload')

cloudinary.config({
  cloud_name: 'dppyvgdpp',
  api_key: '562712989841242',
  api_secret: 'qJN1FD0r-Rp1oulFf7ZkF2Z1_24'
})

const processUpload = async upload => {
  const { stream } = await upload
  let resultUrl = ''

  let resultSecureUrl = ''

  const cloudinaryUpload = async ({ stream }) => {
    try {
      await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.v2.uploader.upload_stream(function (
          error,
          result
        ) {
          if (result) {
            resultUrl = result.secure_url
            resultSecureUrl = result.secure_url
            resolve(resultUrl)
          } else {
            reject(error)
          }
        })

        stream.pipe(streamLoad)
      })
    } catch (err) {
      throw new Error(`Failed to upload profile picture ! Err:${err.message}`)
    }
  }

  await cloudinaryUpload({ stream })
  return resultSecureUrl
}
module.exports = {
  Upload: GraphQLUpload,
  Query: {
    uploads: (parent, args) => {}
  },
  Mutation: {
    singleUpload: async (parent, { file }) => {
      const url = await processUpload(file)
      return {
        url
      }
    }
  }
}
