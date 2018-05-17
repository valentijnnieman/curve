import { createStore } from "redux";
import rootReducer from "./reducers/index";
import { StoreState } from "./types/storeState";

// if (process.env.NODE_ENV === "development") {
//   const devToolsExtension = window.devToolsExtension;

//   if (typeof devToolsExtension === "function") {
//     enhancers.push(devToolsExtension());
//   }
// }

const store = createStore<StoreState>(rootReducer);

export default store;
