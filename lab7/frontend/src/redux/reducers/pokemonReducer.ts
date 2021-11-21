import { SET_PAGE } from "../actions";
import { PokemonInfo } from "../../types/Pokemon";

const initialState: { currentPage: PokemonInfo[] } = {
  currentPage: [],
};

export default function (
  state = initialState,
  action: { type: string; payload: PokemonInfo[] }
) {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
}
