import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import ProteinSearchContainer from './components/proteinSearch/ProteinSearchContainer'
import ProteinViz from './components/proteinViz/ProteinVizContainer'
import PeptideVizContainer from "./components/peptideViz/PeptideVizContainer"
import GelVizContainer from "./components/gelViz/GelVizContainer"
import PumbaNotifications from "./components/PumbaNotifications"
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavItem, NavbarBrand, Collapse , NavLink, NavbarToggler} from 'reactstrap'
import { LinkContainer } from 'react-router-bootstrap';
import logo from './images/sib_logo_2.png';
import logo2 from './images/logo_UNIL.png';
import pumbaConfig from './config'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


class App extends React.Component{

    render(){
        const {proteinIsLoading, history} = this.props

        return <ConnectedRouter history={history}>
                <div id={"routes"}>
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
                            <button disabled={proteinIsLoading}>Coucou</button>
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
    proteinIsLoading: PropTypes.bool
}

const mapStateToProps = (state) => {
    const props = {
        proteinIsLoading: state.loadProtein.proteinIsLoading
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)