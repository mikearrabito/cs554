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
  teams: { [trainer: string]: Set<number> }; // trainer mapped to set of ids of pokemon caught
} = {
  trainersList: [],
  selected: "",
  teams: {},
};

export default function trainersReducer(
  state = initialState,
  action: { type: string; payload: { trainer?: string; pokemonId?: number } }
) {
  let trainer: string | undefined = action.payload?.trainer;
  let pokemonId: number | undefined = action.payload?.pokemonId;
  let new_teams: { [trainer: string]: Set<number> };
  switch (action.type) {
    case ADD_TRAINER:
      if (trainer === undefined) {
        return;
      }
      if (state.trainersList.includes(trainer)) {
        return;
      }
      new_teams = { ...state.teams };
      new_teams[state.selected] = new Set();
      return {
        ...state,
        videos: state.trainersList.push(trainer),
        teams: new_teams,
      };
    case REMOVE_TRAINER:
      // remove training from trainersList, and remove selected pokemon from teams object
      if (trainer === undefined) {
        return;
      }
      new_teams = { ...state.teams }; // make copy
      let new_selected = state.selected;
      if (new_selected === trainer || Object.keys(new_teams).length === 0) {
        new_selected = ""; // if we delete the currently selected trainer, or we have no trainers left, reset selected to ""
      }
      delete new_teams[trainer];
      return {
        trainersList: state.trainersList.filter((tr) => trainer !== tr),
        selected: new_selected,
        teams: new_teams,
      };
    case SELECT_TRAINER:
      if (trainer === undefined) {
        return;
      }
      return {
        ...state,
        selected: trainer,
      };
    case ADD_TO_TEAM:
      // add to set of ids for the team for the currently selected trainer
      if (pokemonId === undefined) {
        return;
      }
      new_teams = { ...state.teams };
      new_teams[state.selected].add(pokemonId);
      return {
        ...state,
        teams: new_teams,
      };
    case REMOVE_FROM_TEAM:
      if (pokemonId === undefined) {
        return;
      }
      new_teams = { ...state.teams };
      new_teams[state.selected].delete(pokemonId);
      return {
        ...state,
        teams: new_teams,
      };
    default:
      return state;
  }
}
