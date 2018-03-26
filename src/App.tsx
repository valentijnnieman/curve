import * as React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Editor from "./pages/Editor";
import Topbar from "./components/ui/Topbar";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Topbar />
          <Route path="/" component={Editor} />
        </div>
      </Router>
    );
  }
}

export default App;
