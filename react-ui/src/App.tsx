import * as React from "react";
import { Provider } from "react-redux";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import Topbar from "./components/ui/Topbar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import store from "./store";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <MuiThemeProvider>
            <Topbar />
            <Route path="/" exact={true} component={Editor} />
            <Route path="/login" exact={true} component={Login} />
            <Route path="/synth/:name" exact={true} component={Editor} />
          </MuiThemeProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
