import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from "react-bootstrap";
import "./Topbar.css";

const Topbar: React.SFC = ({ children }) => (
  <Navbar className="topbar" inverse={true} collapseOnSelect={true}>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#brand">Curve</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem>
          <Link to="/editor">Editor</Link>
        </NavItem>
        <NavDropdown eventKey={3} title="Create" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Osc</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Topbar;
