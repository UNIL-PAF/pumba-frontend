import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import NavBar from './components/NavBar'
import ProteinSearchContainer from './components/proteinSearch/ProteinSearchContainer'
import ProteinViz from './components/proteinViz/ProteinVizContainer'
import PeptideVizContainer from "./components/peptideViz/PeptideVizContainer";

/*
 TODO use cross-fetch!
 */

const App = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <div id={"routes"}>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={ProteinSearchContainer} />
                    <Route path="/proteins" component={ProteinViz} />
                    <Route path="/peptides" component={PeptideVizContainer} />
                    <Route component={ProteinSearchContainer} />
                </Switch>
            </div>
        </ConnectedRouter>
    )
}

App.propTypes = {
    history: PropTypes.object,
}

export default App
