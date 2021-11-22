import { PokemonInfo } from "../../types/Pokemon";
import {
  ADD_TRAINER,
  REMOVE_TRAINER,
  SELECT_TRAINER,
  ADD_TO_TEAM,
  REMOVE_FROM_TEAM,
} from "../actions";

const initialState: {
  trainersList: string[];
  selected: string;
  teams: { [trainer: string]: { id: PokemonInfo } };
} = {
  trainersList: [],
  selected: "",
  teams: {},
};

export default function trainersReducer(
  state = initialState,
  action: {
    type: string;
    payload: {
      trainer?: string;
      pokemonInfo?: PokemonInfo;
      pokemonId?: number;
    };
  }
) {
  let trainer: string | undefined = action.payload?.trainer;
  let pokemonInfo: PokemonInfo | undefined = action.payload?.pokemonInfo;
  let pokemonId: number | undefined = action.payload?.pokemonId;
  let new_teams: { [trainer: string]: { [id: number]: PokemonInfo } };

  switch (action.type) {
    case ADD_TRAINER:
      if (trainer === undefined) {
        return state;
      }
      for (const oldTrainer of state.trainersList) {
        if (oldTrainer.toLowerCase() === trainer.toLowerCase()) {
          // dont allow trainer "Blue" and "blue" to both exist
          return state;
        }
      }
      new_teams = { ...state.teams };
      new_teams[trainer] = {}; // initialize team object for the new trainer
      let newSelected = state.selected;
      if (newSelected === "") {
        // If we are creating our first trainer, set it as selected
        newSelected = trainer;
      }
      return {
        ...state,
        trainersList: state.trainersList.concat(trainer),
        selected: newSelected,
        teams: new_teams,
      };
    case REMOVE_TRAINER:
      // remove training from trainersList, and remove selected trainer from teams object
      if (trainer === undefined) {
        return state;
      }
      new_teams = { ...state.teams }; // make copy
      let new_selected = state.selected;
      if (new_selected === trainer || Object.keys(new_teams).length === 0) {
        new_selected = ""; // if we delete the currently selected trainer (this behavior is disabled on the UI for now), or we have no trainers left, reset selected to ""
      }
      delete new_teams[trainer];
      return {
        trainersList: state.trainersList.filter((tr) => trainer !== tr),
        selected: new_selected,
        teams: new_teams,
      };
    case SELECT_TRAINER:
      if (trainer === undefined) {
        return state;
      }
      return {
        ...state,
        selected: trainer,
      };
    case ADD_TO_TEAM:
      if (pokemonInfo === undefined) {
        return state;
      }
      new_teams = { ...state.teams };
      new_teams[state.selected][pokemonInfo.id] = pokemonInfo; // add info to object containing pokemon for currently selected trainer
      return {
        ...state,
        teams: new_teams,
      };
    case REMOVE_FROM_TEAM:
      if (pokemonId === undefined) {
        return state;
      }
      new_teams = { ...state.teams };
      delete new_teams[state.selected][pokemonId]; // delete key from currently selected trainers team
      return {
        ...state,
        teams: new_teams,
      };
    default:
      return state;
  }
}
