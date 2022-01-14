const { createClient } = require("redis");
const axios = require("axios");

const redisClient = createClient();
(async () => {
  await redisClient.connect();
})();

const DEFAULT_PER_PAGE = 20;
const BASE_IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
const POKEMON_API = "https://pokeapi.co/api/v2/pokemon/";

const kebabToCamelCase = (kebabCaseString: string): string => {
  const camelCaseString = kebabCaseString.replace(/-./g, (x) =>
    x[1].toUpperCase()
  );
  return camelCaseString;
};

const capitalize = (str: string): string => {
  if (str.length === 0) {
    return "";
  }
  return str[0].toUpperCase() + str.slice(1);
};

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
      const cached = await redisClient.hGet("cachedPages", page.toString());
      if (cached !== null) {
        return JSON.parse(cached);
      }
      let response;
      try {
        response = await axios.get(POKEMON_API, {
          params: { limit: DEFAULT_PER_PAGE, offset: page * DEFAULT_PER_PAGE },
        });
      } catch (e) {
        return { totalCount: 0, perPage: 0, pokemonList: [] };
      }
      const pokemonList = [];
      for (const data of response.data.results) {
        const id = data.url.split("/").at(-2);
        pokemonList.push({
          id,
          name: capitalize(data.name),
          image: `${BASE_IMAGE_URL}/${id}.png`,
        });
      }
      const returnData = {
        pokemonList,
        totalCount: response.data.count,
        perPage: DEFAULT_PER_PAGE,
      };
      await redisClient.hSet(
        "cachedPages",
        page.toString(),
        JSON.stringify(returnData)
      );
      return returnData;
    },
    getPokemon: async (_: any, args: { id: number }) => {
      // return single pokemon with a given id, or null if not found
      const { id } = args;
      const cached = await redisClient.hGet("cachedDetails", id.toString());
      if (cached !== null) {
        return JSON.parse(cached);
      }
      let response;
      try {
        response = await axios.get(`${POKEMON_API}${id}`);
      } catch (e) {
        return null;
      }
      const data = response.data;
      const types = [];
      for (const type of data.types) {
        const current = type.type;
        types.push(capitalize(current.name));
      }
      const stats: { [statName: string]: number } = {};
      for (const stat of data.stats) {
        const statVal = stat.base_stat;
        const statName = kebabToCamelCase(stat.stat.name); // convert kebab case fields (special-attack) to specialAttack
        stats[statName] = statVal;
      }
      const abilities: string[] = [];
      for (const ability of data.abilities) {
        abilities.push(capitalize(ability.ability.name));
      }
      const moves: string[] = [];
      for (const move of data.moves) {
        moves.push(kebabToCamelCase(move.move.name));
      }
      const pokemon = {
        info: {
          id: data.id,
          name: capitalize(data.name),
          image: `${BASE_IMAGE_URL}${id}.png`,
        },
        attributes: {
          height: data.height,
          weight: data.weight,
          base_experience: data.base_experience,
          types,
          stats,
          abilities,
          moves,
        },
      };
      await redisClient.hSet(
        "cachedDetails",
        id.toString(),
        JSON.stringify(pokemon)
      );
      return pokemon;
    },
  },
};
