import * as React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Editor from "./pages/Editor";
import Topbar from "./components/ui/Topbar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class App extends React.Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider>
          <Topbar />
          <Route path="/" component={Editor} />
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
