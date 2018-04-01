import * as React from "react";
import { Provider } from "react-redux";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Editor from "./pages/Editor";
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
            <Route path="/" component={Editor} />
          </MuiThemeProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
