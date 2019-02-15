import { combineReducers } from 'redux'
import loadProteinReducer from './loadProtein'
import sampleSelectionReducer from './sampleSelection'
import merged2DPlotReducer from "./proteinVizReducer";
import peptideVizReducer from "./peptideVizReducer"

const rootReducer = combineReducers({
    loadProtein: loadProteinReducer,
    sampleSelection: sampleSelectionReducer,
    merged2DPlot: merged2DPlotReducer,
    peptideViz: peptideVizReducer
})

export default rootReducer
