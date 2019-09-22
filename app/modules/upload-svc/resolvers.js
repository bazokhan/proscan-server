const axios = require('axios');
const cloudinary = require('cloudinary');
const { GraphQLUpload } = require('graphql-upload');

cloudinary.config({
  cloud_name: 'dynb9exxd',
  api_key: '147518668696656',
  api_secret: '-IscSGWbAqJ2unP3_djNVILemcM'
});

const processUpload = async upload => {
  const { createReadStream } = await upload;
  const stream = createReadStream();
  let resultUrl = '';

  let resultSecureUrl = '';

  const cloudinaryUpload = async ({ stream }) => {
    try {
      await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.v2.uploader.upload_stream(function(
          error,
          result
        ) {
          if (result) {
            resultUrl = result.secure_url;
            resultSecureUrl = result.secure_url;
            resolve(resultUrl);
          } else {
            reject(error);
          }
        });

        stream.pipe(streamLoad);
      });
    } catch (err) {
      throw new Error(`Failed to upload profile picture ! Err:${err.message}`);
    }
  };

  await cloudinaryUpload({ stream });
  return resultSecureUrl;
};
module.exports = {
  Upload: GraphQLUpload,
  Query: {
    uploads: (parent, args) => {}
  },
  Mutation: {
    singleUpload: async (parent, { file }) => {
      const url = await processUpload(file);
      return {
        url
      };
    },
    multipleUpload: async (parent, { files }) => {
      const urls = [];
      for (const file of files) {
        const url = await processUpload(file);
        urls.push({ url });
      }
      return urls;
    }
  }
};
