import { combineReducers } from 'redux'
import loadProteinReducer from './loadProtein'
import sampleSelectionReducer from './sampleSelection'
import merged2DPlotReducer from "./merged2DPlotReducer";

const rootReducer = combineReducers({
    loadProtein: loadProteinReducer,
    sampleSelection: sampleSelectionReducer,
    merged2DPlot: merged2DPlotReducer
})

export default rootReducer
