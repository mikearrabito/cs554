const redis = require("redis");
const uuid = require("uuid");

module.exports = {
  Query: {
    unsplashImages: async () => {},
    binnedImages: null,
    userPostedImages: null,
  },
  Mutations: {
    uploadImage: null,
    updateImage: null,
    deleteImage: null,
  },
  ImagePost: {
    id: null,
    url: null,
    posterName: null,
    description: null,
    userPosted: null,
    binned: null,
  },
};
