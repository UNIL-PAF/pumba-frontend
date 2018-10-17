import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Row, Col, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../images/Pumba.png';
import pumbaConfig from '../config'

const NavBar = () => (
  <div>
      <Navbar fluid>
          <Navbar.Header>
              <Navbar.Brand>
                  <div id="logo">
                          <span>
                            <a href="https://www.unil.ch/paf/en/home.html">
                                <img src={logo} height="30" alt="PAF UNIL"/>
                            </a>
                          </span>
                  </div>
              </Navbar.Brand>
              <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
              <Nav>
                  <LinkContainer to="/" exact={true}>
                      <NavItem eventKey={1} >Search</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/proteins">
                      <NavItem eventKey={2}>Proteins</NavItem>
                  </LinkContainer>
              </Nav>
              <Nav pullRight>
                  <NavItem>Version {pumbaConfig.version}</NavItem>
              </Nav>
          </Navbar.Collapse>
      </Navbar>
  </div>
)

export default NavBar


