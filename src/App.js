import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import NavBar from './components/NavBar'
import ProteinSearchContainer from './components/proteinSearch/ProteinSearchContainer'
import ProteinViz from './components/proteinViz/ProteinVizContainer'
import PeptideVizContainer from "./components/peptideViz/PeptideVizContainer"
import GelVizContainer from "./components/gelViz/GelVizContainer"
import PumbaNotifications from "./components/PumbaNotifications"

const App = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <div id={"routes"}>
                <NavBar />
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
    )
}

App.propTypes = {
    history: PropTypes.object,
}

export default App