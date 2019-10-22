import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavItem, NavbarBrand, Collapse , NavLink, NavbarToggler} from 'reactstrap'
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../images/sib_logo_2.png';
import logo2 from '../images/logo_UNIL.png';
import pumbaConfig from '../config'

const NavBar = () => (
  <div>
      <Navbar color="light" light expand="md">
          <NavbarBrand tag={Link} to="/"><img src={logo2} height="30" alt="SIB"/>&nbsp;<img src={logo} height="30" alt="UNIL"/></NavbarBrand>
          <NavbarToggler/>
          <Collapse isOpen={true} navbar>
              <Nav className="ml-auto" navbar>
                  <NavItem>
                      <LinkContainer to="/" exact={true}>
                          <NavLink tag={Link} to="/">Search</NavLink>
                      </LinkContainer>
                  </NavItem>
                  <NavItem>
                      <LinkContainer to="/lanes">
                          <NavLink tag={Link} to="/lanes">Lanes</NavLink>
                      </LinkContainer>
                  </NavItem>
                  <NavItem>
                      <LinkContainer to="/graph">
                        <NavLink tag={Link} to="/graph">Graph</NavLink>
                      </LinkContainer>
                  </NavItem>
                  <NavItem>
                      <LinkContainer to="/peptides">
                          <NavLink tag={Link} to="/peptides">Peptides</NavLink>
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