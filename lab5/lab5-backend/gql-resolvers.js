const { createClient } = require("redis");
const axios = require("axios");
const { v4: uuid } = require("uuid");

let redisClient;
(async () => {
  redisClient = createClient();
  await redisClient.connect();
})();

const { UNSPLASH_ACCESS_KEY } = process.env;
const unsplashApi = "https://api.unsplash.com/photos";

module.exports = {
  Query: {
    unsplashImages: async (parent, args, context, info) => {
      const { pageNum } = args;

      const response = await axios.get(unsplashApi, {
        params: { page: pageNum, client_id: UNSPLASH_ACCESS_KEY },
      });
      const data = response.data;

      const images = [];
      for (const image of data) {
        img = {};
        img.id = image.id;
        img.url = image.urls.regular;
        img.posterName = image.user.username;
        img.description = image.description;
        img.userPosted = false;
        img.binned = false;
        images.push(img);
      }

      return images;
    },
    binnedImages: async (parent, args, context, info) => {
      // TODO
    },
    userPostedImages: async (parent, args, context, info) => {
      // TODO
    },
  },
  Mutation: {
    uploadImage: async (parent, args, context, info) => {
      const { url, description, posterName } = args;
      const binned = false;
      const userPosted = true;
      const id = uuid();
      const image = {
        id,
        url,
        posterName,
        description,
        userPosted,
        binned,
      };
      await redisClient.hSet("images", id, JSON.stringify(image));
      return image;
    },
    updateImage: async (parent, args, context, info) => {
      const { id, url, posterName, description, userPosted, binned } = args;
      let image = {};
      // TODO
      return image;
    },
    deleteImage: async (parent, args, context, info) => {
      const { id } = args;
      let image = await redisClient.hGet("images", id);
      image = JSON.parse(image);
      await redisClient.hDel("images", id);
      return image;
    },
  },
  // ImagePost: {
  //   id: async (parent, args, context, info) => {},
  //   url: async (parent, args, context, info) => {},
  //   posterName: async (parent, args, context, info) => {},
  //   description: async (parent, args, context, info) => {},
  //   userPosted: async (parent, args, context, info) => {},
  //   binned: async (parent, args, context, info) => {},
  // },
};
