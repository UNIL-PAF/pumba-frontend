import React from 'react'
import {ConnectedRouter} from 'connected-react-router'
import {connect} from 'react-redux'
import {Route, Switch} from 'react-router'
import ProteinSearchContainer from './components/proteinSearch/ProteinSearchContainer'
import ProteinViz from './components/proteinViz/ProteinVizContainer'
import PeptideVizContainer from "./components/peptideViz/PeptideVizContainer"
import GelVizContainer from "./components/gelViz/GelVizContainer"
import PumbaNotifications from "./components/PumbaNotifications"
import PumbaError from "./components/PumbaError"
import {Link} from 'react-router-dom'
import {Navbar, Nav, NavItem, NavbarBrand, Collapse, NavLink, NavbarToggler} from 'reactstrap'
import {LinkContainer} from 'react-router-bootstrap';
import logo2 from './images/logo_UNIL.png';
import PropTypes from 'prop-types'
import LoadEntry from "./components/entry/LoadEntry";


class App extends React.Component {

    render() {
        const {history, organism} = this.props

        const organismClass = organism === "human" ? "human-organism" : "mouse-organism"
        const organismName = organism === "human" ? "Human" : "Mouse"

        return (
            <ConnectedRouter history={history}>
                <div id={"routes"}>
                    <Navbar color="light" light expand="md" className={organismClass}>
                        <NavbarBrand tag={Link} to="/">
                            <div>
                                <img src={logo2} height="30" alt="UNIL"/>
                                <span id="navbar-pumba-title">
                      Pumba - {organismName}
                    </span>
                            </div>
                        </NavbarBrand>
                        <NavbarToggler/>
                        <Collapse isOpen={true} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <LinkContainer to="/" exact={true}>
                                        <NavLink tag={Link} to="/" className={organismClass}>
                                            Search
                                        </NavLink>
                                    </LinkContainer>
                                </NavItem>
                                <NavItem>
                                    <LinkContainer to="/lanes">
                                        <NavLink
                                            tag={Link}
                                            to="/lanes"
                                            className={organismClass}
                                        >
                                            Lanes
                                        </NavLink>
                                    </LinkContainer>
                                </NavItem>
                                <NavItem>
                                    <LinkContainer to="/graph">
                                        <NavLink
                                            tag={Link}
                                            to="/graph"
                                            className={organismClass}
                                        >
                                            Graph
                                        </NavLink>
                                    </LinkContainer>
                                </NavItem>
                                <NavItem>
                                    <LinkContainer to="/peptides">
                                        <NavLink
                                            tag={Link}
                                            to="/peptides"
                                            className={organismClass}
                                        >
                                            Peptides
                                        </NavLink>
                                    </LinkContainer>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <LinkContainer to="#">
                                        <NavLink
                                            to='#'
                                            className={organismClass}
                                            onClick={(e) => {
                                                window.location.href = "mailto:roman.mylonas@unil.ch";
                                                e.preventDefault();
                                            }}
                                        >
                                            {"Contact"}
                                        </NavLink>
                                    </LinkContainer>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                    <Switch>
                        <Route exact path="/" component={ProteinSearchContainer}/>
                        <Route path="/graph/:id" component={ProteinViz}/>
                        <Route path="/graph" component={ProteinViz}/>
                        <Route path="/peptides/:id" component={PeptideVizContainer}/>
                        <Route path="/peptides" component={PeptideVizContainer}/>
                        <Route path="/lanes/:id" component={GelVizContainer}/>
                        <Route path="/lanes" component={GelVizContainer}/>
                        <Route path="/entry/:id/:type" component={LoadEntry}/>
                        <Route path="/entry/:id" component={LoadEntry}/>
                        <Route component={PumbaError}/>
                    </Switch>
                    <PumbaNotifications/>
                </div>
            </ConnectedRouter>
        );
    }
}

App.propTypes = {
    history: PropTypes.object,
    organism: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
    const props = {
        organism: state.menu.organism
    }
    return props
}

export default connect(mapStateToProps, null)(App)