import * as React from "react";
import { Provider } from "react-redux";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Editor from "./pages/Editor";
import store from "./store";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route path="/" exact={true} component={Editor} />
            <Route path="/synth/:name" exact={true} component={Editor} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
