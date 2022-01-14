import { SET_PAGE, SET_DETAILS } from "../actions";
import { PokemonDetails, PokemonInfo } from "../../types/Pokemon";

const initialState: { currentPage: PokemonInfo[]; details: {} } = {
  currentPage: [],
  details: {},
};

const pokemonReducer = (
  state = initialState,
  action: {
    type: string;
    payload: { pokemonList?: PokemonInfo[]; details: PokemonDetails };
  }
) => {
  let pokemonList: PokemonInfo[] | undefined = action.payload?.pokemonList;
  let details: PokemonDetails | undefined = action.payload?.details;
  switch (action.type) {
    case SET_PAGE:
      if (pokemonList === undefined) {
        return state;
      }
      return {
        ...state,
        currentPage: pokemonList,
      };
    case SET_DETAILS:
      if (details === undefined) {
        return state;
      }
      return {
        ...state,
        details,
      };
    default:
      return state;
  }
};

export default pokemonReducer;
