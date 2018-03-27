import * as React from "react";
import AppBar from "material-ui/AppBar";
import "./Topbar.css";

import { connect } from "react-redux";

import { NodeDataObject, GainDataObject } from "../../types/nodeObject";
import { createNode } from "../../actions/node";
import { Dropdown } from "./Dropdown";

const CurveSVG = require("../../curve.svg");

interface TopbarProps {
  createNode: (node: NodeDataObject | GainDataObject) => void;
}

class Topbar extends React.Component<TopbarProps> {
  render() {
    return (
      <AppBar
        title="Curve"
        className="topbar"
        iconElementLeft={<img src={CurveSVG} width={48} className="logo" />}
      >
        <Dropdown createNode={this.props.createNode} />
      </AppBar>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    createNode: (node: NodeDataObject | GainDataObject) =>
      dispatch(createNode(node))
  };
};

export default connect(null, mapDispatchToProps)(Topbar);
