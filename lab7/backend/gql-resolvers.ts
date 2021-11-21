const { createClient } = require("redis");
const axios = require("axios");

const redisClient = createClient();
(async () => {
  await redisClient.connect();
})();

const baseImageUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

const POKEMON_API = "https://pokeapi.co/api/v2/pokemon/";
//TODO: renable redis
module.exports = {
  Query: {
    getPokemonList: async (
      _: any,
      args: {
        page: number | undefined | null;
      }
    ) => {
      let { page }: { page: number | undefined | null } = args;
      // if page argument is not given or given as null, set to 0
      if (page == null) {
        // == null catches null and undefined
        page = 0;
      }
      if (await redisClient.hExists("cached-pages", page)) {
        const data = await redisClient.hGet("cached-pages", page);
        return JSON.parse(data);
      }
      let response;
      try {
        response = await axios.get(POKEMON_API, {
          params: { limit: 20, offset: page * 20 }, // 20 per page
        });
      } catch (e) {
        return [];
      }
      const pokemonList = [];
      for (const data of response.data.results) {
        let split = data.url.split("/");
        const id = split[split.length - 2];
        pokemonList.push({
          id,
          name: data.name,
          image: `${baseImageUrl}${id}.png`,
        });
      }
      //await redisClient.hSet("cached-pages", page, JSON.stringify(pokemonList));
      return pokemonList;
    },
    getPokemon: async (_: any, args: { id: number }) => {
      // return single pokemon with a given id, or null if not found
      const { id } = args;
      if (await redisClient.hExists("cached-details", id)) {
        const data = redisClient.hGet("cached-details", id);
        return JSON.parse(data);
      }
      let response;
      try {
        response = await axios.get(`${POKEMON_API}${id}`);
      } catch (e) {
        return null;
      }
      const data = response.data;
      const pokemon = {
        info: {
          id: data.id,
          name: data.name,
          image: `${baseImageUrl}${id}.png`,
        },
        attributes: {
          height: data.height,
          weight: data.weight,
          base_experience: data.base_experience,
        },
      };
      //await redisClient.hSet("cached-details", id, JSON.stringify(pokemon));
      return pokemon;
    },
  },
};
