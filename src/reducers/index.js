import { combineReducers } from 'redux'
import loadProteinReducer from './loadProtein'
import sampleSelectionReducer from './sampleSelection'
import proteinVizReducer from "./proteinVizReducer";
import peptideVizReducer from "./peptideVizReducer"
import menuReducer from "./menuReducer";
import commonInfoReducer from "./commonInfoReducer"


const rootReducer = combineReducers({
    loadProtein: loadProteinReducer,
    sampleSelection: sampleSelectionReducer,
    proteinViz: proteinVizReducer,
    peptideViz: peptideVizReducer,
    menu: menuReducer,
    commonInfo: commonInfoReducer
})

export default rootReducer
