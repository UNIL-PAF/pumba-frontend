import React from 'react'
import { Route, Switch } from 'react-router'
import NavBar from '../components/NavBar'
import ProteinSearchContainer from '../components/proteinSearch/ProteinSearchContainer'
import ProteinViz from '../components/proteinViz/ProteinVizContainer'
import PeptideVizContainer from "../components/peptideViz/PeptideVizContainer";

const routes = (
  <div id={"routes"}>
    <NavBar />
    <Switch>
      <Route exact path="/" component={ProteinSearchContainer} />
      <Route path="/proteins" component={ProteinViz} />
        <Route path="/peptides" component={PeptideVizContainer} />
      <Route component={ProteinSearchContainer} />
    </Switch>
  </div>
)

export default routes
