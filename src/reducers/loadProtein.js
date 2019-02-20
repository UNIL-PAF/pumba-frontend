import {
    REQUEST_PROTEIN, PROTEIN_IS_LOADED, ADD_PROTEIN_DATA, PROTEIN_LOAD_ERROR,
    GOTO_VIZ, ADD_SEQUENCE_DATA
} from '../actions/loadProtein'

const initialState = {
    proteinIsLoading: false,
    proteinData: null,
    timestamp: undefined
}

const loadProteinReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_PROTEIN:
            return { ...state, proteinIsLoading: true }
        case PROTEIN_IS_LOADED:
            return { ...state, proteinIsLoading: false, finishedLoading: true}
        case ADD_PROTEIN_DATA:
            return { ...state, proteinData: action.proteinData}
        case ADD_SEQUENCE_DATA:
            return { ...state, sequenceData: action.sequenceData}
        case PROTEIN_LOAD_ERROR:
            return { ...state, error: action.error}
        case GOTO_VIZ:
            return { ...state, gotoViz: action.gotoViz}
        default:
            return state
    }
}

export default loadProteinReducer
