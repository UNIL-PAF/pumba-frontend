import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Row, Col, NavItem, NavbarBrand, Collapse , NavLink, NavbarToggler} from 'reactstrap'
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../images/Pumba.png';
import pumbaConfig from '../config'

const NavBar = () => (
  <div>
      <Navbar color="light" light expand="md">
          <NavbarBrand tag={Link} to="/"><img src={logo} height="30" alt="Pumba"/></NavbarBrand>
          <NavbarToggler/>
          <Collapse isOpen={true} navbar>
              <Nav className="ml-auto" navbar>
                  <NavItem>
                      <LinkContainer to="/" exact={true}>
                          <NavLink tag={Link} to="/">Search</NavLink>
                      </LinkContainer>
                  </NavItem>
                  <NavItem>
                      <LinkContainer to="/proteins">
                        <NavLink tag={Link} to="/proteins">Proteins</NavLink>
                      </LinkContainer>
                  </NavItem>
              </Nav>
              <Nav className="ml-auto" navbar>
                  <NavItem>
                      Version {pumbaConfig.version}
                  </NavItem>
              </Nav>
          </Collapse>
      </Navbar>
  </div>
)

export default NavBar




// <Navbar fluid>
//
// <Collapse>
// <Nav>
// <NavLink to="/" exact={true}>
//     <NavItem eventKey={1} >Search</NavItem>
// </NavLink>
// <NavLink to="/proteins">
//     <NavItem eventKey={2}>Proteins</NavItem>
//     </NavLink>
// </Nav>
// <Nav pullRight>
//     <NavItem>Version {pumbaConfig.version}</NavItem>
//     </Nav>
// </Collapse>
// </Navbar>

//
// <NavbarBrand>
// <div id="logo">
//     <span>
//     <a href="https://www.unil.ch/paf/en/home.html">
//     <img src={logo} height="30" alt="PAF UNIL"/>
//     </a>
// </span>
// </div>
// </NavbarBrand>