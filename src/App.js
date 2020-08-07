import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import ProteinSearchContainer from './components/proteinSearch/ProteinSearchContainer'
import ProteinViz from './components/proteinViz/ProteinVizContainer'
import PeptideVizContainer from "./components/peptideViz/PeptideVizContainer"
import GelVizContainer from "./components/gelViz/GelVizContainer"
import PumbaNotifications from "./components/PumbaNotifications"
import PlotOptionsButton from "./components/options/PlotOptionsButton"
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavItem, NavbarBrand, Collapse , NavLink, NavbarToggler} from 'reactstrap'
import { LinkContainer } from 'react-router-bootstrap';
import logo2 from './images/logo_UNIL.png';
import pumbaConfig from './config'
import PropTypes from 'prop-types'


class App extends React.Component{

    render(){
        const {history, organism} = this.props

        const organismClass = organism === "human" ? "human-organism" : "mouse-organism"
        const organismName = organism === "human" ? "Human" : "Mouse"

        return <ConnectedRouter history={history}>
                <div id={"routes"}>
                    <Navbar color="light" light expand="md" className={organismClass}>
                        <NavbarBrand tag={Link} to="/"><img src={logo2} height="30" alt="UNIL"/></NavbarBrand>
                        <NavbarToggler/>
                        <Collapse isOpen={true} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <LinkContainer to="/" exact={true}>
                                        <NavLink tag={Link} to="/" className={organismClass}>Search</NavLink>
                                    </LinkContainer>
                                </NavItem>
                                <NavItem>
                                    <LinkContainer to="/lanes">
                                        <NavLink tag={Link} to="/lanes" className={organismClass}>Lanes</NavLink>
                                    </LinkContainer>
                                </NavItem>
                                <NavItem>
                                    <LinkContainer to="/graph">
                                        <NavLink tag={Link} to="/graph" className={organismClass}>Graph</NavLink>
                                    </LinkContainer>
                                </NavItem>
                                <NavItem>
                                    <LinkContainer to="/peptides">
                                        <NavLink tag={Link} to="/peptides" className={organismClass}>Peptides</NavLink>
                                    </LinkContainer>
                                </NavItem>
                                <NavItem>
                                    <PlotOptionsButton></PlotOptionsButton>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                <NavItem id="menu-organism-label">
                                    {organismName}
                                </NavItem>
                                <NavItem id="menu-version-label">
                                    Version {pumbaConfig.version}
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                    <Switch>
                        <Route exact path="/" component={ProteinSearchContainer} />
                        <Route path="/graph" component={ProteinViz} />
                        <Route path="/peptides" component={PeptideVizContainer} />
                        <Route path="/lanes" component={GelVizContainer} />
                        <Route component={ProteinSearchContainer} />
                    </Switch>
                    <PumbaNotifications/>
                </div>
            </ConnectedRouter>
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

//export default App