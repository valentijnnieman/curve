import * as React from "react";
import AppBar from "material-ui/AppBar";
import "./Topbar.css";

import Joyride, { Step } from "react-joyride";
import { joyrideSteps } from "../../lib/joyrideSteps";

import { connect } from "react-redux";

import { OscData, GainData } from "../../types/blockData";
import { createBlock } from "../../actions/block";
import { Dropdown } from "./Dropdown";

import FlatButton from "material-ui/FlatButton";

const CurveSVG = require("../../curve.svg");

interface TopbarState {
  joyrideIsRunning: boolean;
}

interface TopbarProps {
  createBlock: (node: OscData | GainData) => void;
}

class Topbar extends React.Component<TopbarProps, TopbarState> {
  joyride: Joyride;
  constructor(props: TopbarProps) {
    super(props);
    this.state = {
      joyrideIsRunning: false
    };
  }
  render() {
    return (
      <AppBar
        title="Curve"
        className="topbar"
        iconElementLeft={<img src={CurveSVG} width={48} className="logo" />}
        iconElementRight={
          <FlatButton
            label="Take a tour"
            onClick={() => this.setState({ joyrideIsRunning: true })}
          />
        }
      >
        <Joyride
          ref={c => (this.joyride = c as Joyride)}
          run={this.state.joyrideIsRunning} // or some other boolean for when you want to start it
          debug={false}
          steps={joyrideSteps as Step[]}
          type="continuous"
          autoStart={true}
        />
        <Dropdown createBlock={this.props.createBlock} />
      </AppBar>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    createBlock: (node: OscData | GainData) => dispatch(createBlock(node))
  };
};

export default connect(null, mapDispatchToProps)(Topbar);
