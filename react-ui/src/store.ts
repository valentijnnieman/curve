import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/index";
import { StoreState } from "./types/storeState";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore<StoreState, any, any, any>(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

export default store;
