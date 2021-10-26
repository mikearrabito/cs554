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
      const data = await redisClient.hVals("images");
      const images = [];
      for (const val of data) {
        const image = JSON.parse(val);
        if (image.binned === true) {
          images.push(image);
        }
      }
      return images;
    },
    userPostedImages: async (parent, args, context, info) => {
      const data = await redisClient.hVals("images");
      const images = [];
      for (const val of data) {
        const image = JSON.parse(val);
        if (image.userPosted === true) {
          images.push(image);
        }
      }
      return images;
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
      let { id, url, posterName, description, userPosted, binned } = args;

      let oldImage;
      if (await redisClient.hExists("images", id)) {
        oldImage = await redisClient.hGet("images", id);
        oldImage = JSON.parse(oldImage);
      }
      if (oldImage) {
        url = url ?? oldImage.url;
        posterName = posterName ?? oldImage.posterName;
        description = description ?? oldImage.description;
        userPosted = userPosted ?? oldImage.userPosted;
        binned = binned ?? oldImage.binned;
      }

      let image = {
        id,
        url,
        posterName,
        description,
        userPosted,
        binned,
      };

      if (!((await redisClient.hExists("images", id)) && binned === true)) {
        await redisClient.hSet("images", id, JSON.stringify(image));
      }
      if (binned === false && userPosted === false) {
        await redisClient.hDel("images", id);
      }
      if (await redisClient.hExists("images", id)) {
        redisClient.hSet("images", id, JSON.stringify(image));
      }
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
};
