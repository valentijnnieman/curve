import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
// remove service worker for now, as the app will be updated regularly
// registerServiceWorker();
