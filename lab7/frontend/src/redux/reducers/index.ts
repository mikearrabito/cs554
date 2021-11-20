import { combineReducers } from "redux";
import trainersReducer from "./trainersReducer";

export default combineReducers({
  trainers: trainersReducer,
});
