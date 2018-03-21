import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from "react-bootstrap";

const Topbar: React.SFC = ({ children }) => (
  <Navbar inverse={true} collapseOnSelect={true}>
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
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider={true} />
          <MenuItem eventKey={3.3}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Topbar;
