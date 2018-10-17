import {REQUEST_PROTEIN, PROTEIN_IS_LOADED, ADD_PROTEIN_DATA, PROTEIN_LOAD_ERROR} from '../actions/loadProtein'

const initialState = {
    proteinIsLoading: false,
    proteinData: []
}

const loadProteinReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_PROTEIN:
            return { ...state, proteinIsLoading: true }
        case PROTEIN_IS_LOADED:
            return { ...state, proteinIsLoading: false}
        case ADD_PROTEIN_DATA:
            const newProteinData = state.proteinData.concat(action.proteinData)
            return { ...state, proteinData: newProteinData}
        case PROTEIN_LOAD_ERROR:
            return { ...state, error: action.error}
        default:
            return state
    }
}

export default loadProteinReducer
