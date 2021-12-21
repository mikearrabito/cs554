const { createClient } = require("redis");
const axios = require("axios");
const { v4: uuid } = require("uuid");

let redisClient;
(async () => {
  redisClient = createClient();
  await redisClient.connect();
})();

const { UNSPLASH_ACCESS_KEY } = process.env;
const UNSPLASH_API = "https://api.unsplash.com/photos";

module.exports = {
  Query: {
    unsplashImages: async (parent, args, context, info) => {
      const { pageNum } = args;

      const response = await axios.get(UNSPLASH_API, {
        params: { page: pageNum, client_id: UNSPLASH_ACCESS_KEY },
      });
      const data = response.data;

      const images = [];
      for (const image of data) {
        img = {};
        img.id = image.id;
        img.url = image.urls.small;
        img.posterName = image.user.username;
        img.description = image.description;
        img.userPosted = false;
        if (await redisClient.hExists("images", img.id)) {
          let current = await redisClient.hGet("images", img.id);
          current = JSON.parse(current);
          img.binned = current.binned; // if this image is in our cache already and was binned, set it to binned in response
          img.numBinned = current.numBinned; // if user liked this photo on our end, show it instead of using number from api response
        } else {
          img.binned = false;
          img.numBinned = image.likes;
        }
        images.push(img);
      }
      return images;
    },
    binnedImages: async () => {
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
    userPostedImages: async () => {
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
    getTopTenBinnedPosts: async () => {
      const topTenBinnedIds = await redisClient.zRange("top-binned", 0, 9, {
        REV: true,
      });
      const images = [];
      for (const id of topTenBinnedIds) {
        const image = await redisClient.hGet("images", id);
        images.push(JSON.parse(image));
      }
      return images;
    },
  },
  Mutation: {
    uploadImage: async (parent, args, context, info) => {
      const { url, description, posterName } = args;
      const id = uuid();
      const image = {
        id,
        url,
        posterName,
        description,
        userPosted: true,
        binned: false,
        numBinned: 0,
      };
      await redisClient.hSet("images", id, JSON.stringify(image));
      return image;
    },
    updateImage: async (parent, args, context, info) => {
      let { id, url, posterName, description, userPosted, binned, numBinned } =
        args;
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
        numBinned = numBinned ?? oldImage.numBinned;
      }

      if (userPosted && binned) {
        oldImage.binned = true;
      }

      const image = {
        id,
        url,
        posterName,
        description,
        userPosted,
        binned,
        numBinned,
      };

      if (binned === true) {
        await redisClient.zAdd("top-binned", {
          score: image.numBinned,
          value: id,
        });
      } else {
        await redisClient.zRem("top-binned", id);
      }

      if (binned === false && userPosted === false) {
        await redisClient.hDel("images", id);
      } else {
        // binned or userposted
        await redisClient.hSet("images", id, JSON.stringify(image));
      }
      return image;
    },
    deleteImage: async (parent, args, context, info) => {
      const { id } = args;
      let image = await redisClient.hGet("images", id);
      image = JSON.parse(image);
      await redisClient.hDel("images", id);

      // if image was binned, remove from top-binned
      await redisClient.zRem("top-binned", id);
      return image;
    },
  },
};
