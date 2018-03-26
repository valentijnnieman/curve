import * as React from "react";
import { Navbar, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import "./Topbar.css";

import { connect } from "react-redux";

import { NodeDataObject, GainDataObject } from "../../types/nodeObject";
import { createNode } from "../../actions/node";

interface TopbarProps {
  createNode: (node: NodeDataObject | GainDataObject) => void;
}

class Topbar extends React.Component<TopbarProps> {
  render() {
    return (
      <Navbar className="topbar" inverse={true} collapseOnSelect={true}>
        <Navbar.Header>
          <Navbar.Brand>
            <a>Curve</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={3} title="Create" id="basic-nav-dropdown">
              <MenuItem
                onClick={() => {
                  const newOscNode = {
                    id: 999,
                    type: "square" as OscillatorType,
                    freq: 330,
                    output: undefined,
                    hasInternal: false,
                    running: false,
                    hasInput: false,
                    hasInputFrom: [],
                    isConnectedToOutput: false,
                    isConnectedTo: undefined,
                    connected: false,
                    connectedToEl: undefined,
                    connectedFromEl: undefined
                  };
                  this.props.createNode(newOscNode);
                }}
              >
                Oscillator
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const newOscNode = {
                    id: 999,
                    gain: 1,
                    output: undefined,
                    hasInternal: false,
                    hasInput: false,
                    hasInputFrom: [],
                    isConnectedToOutput: false,
                    isConnectedTo: undefined,
                    connected: false,
                    connectedToEl: undefined,
                    connectedFromEl: undefined
                  };
                  this.props.createNode(newOscNode);
                }}
              >
                Gain
              </MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
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
