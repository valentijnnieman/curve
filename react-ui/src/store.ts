import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/index";
import { StoreState } from "./types/storeState";

const store = createStore<StoreState, any, any, any>(
  rootReducer,
  applyMiddleware(thunkMiddleware)
);

export default store;
