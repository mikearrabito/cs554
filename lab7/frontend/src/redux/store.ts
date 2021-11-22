import { createStore, compose } from "redux";
import rootReducer from "./reducers";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // chrome redux dev tools extension

const initialState = {};

export default createStore(rootReducer, initialState, composeEnhancers());
