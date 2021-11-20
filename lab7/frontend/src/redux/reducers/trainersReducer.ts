import { ADD_TRAINER } from "../actions";

const initialState: { trainers: string[] } = {
  trainers: [],
};

export default function (
  state = initialState,
  action: { type: string; payload: string }
) {
  switch (action.type) {
    case ADD_TRAINER:
      return {
        ...state,
        videos: state.trainers.push(action.payload),
      };
    default:
      return state;
  }
}
