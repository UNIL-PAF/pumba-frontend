import { combineReducers } from 'redux'
import loadProteinReducer from './loadProtein'
import sampleSelectionReducer from './sampleSelection'
import proteinVizReducer from "./proteinVizReducer";
import peptideVizReducer from "./peptideVizReducer"

const rootReducer = combineReducers({
    loadProtein: loadProteinReducer,
    sampleSelection: sampleSelectionReducer,
    proteinViz: proteinVizReducer,
    peptideViz: peptideVizReducer
})

export default rootReducer
