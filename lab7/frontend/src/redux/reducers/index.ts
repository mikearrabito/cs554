import { combineReducers } from "redux";
import pokemonReducer from "./pokemonReducer";
import trainersReducer from "./trainersReducer";

export default combineReducers({
  trainers: trainersReducer,
  pokemon: pokemonReducer,
});
