import {
    CHANGE_ZOOM_RANGE,
    CHANGE_THEO_MERGED_PROTEINS
} from '../actions/proteinVizActions'

const initialState = {
    zoomLeft: undefined,
    zoomRight: undefined,
    theoMergedProteins: null
}

const proteinVizReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_ZOOM_RANGE:
            return { ...state, zoomLeft: action.left, zoomRight: action.right }
        case CHANGE_THEO_MERGED_PROTEINS:
            return { ...state, theoMergedProteins: action.theoMergedProteins}
        default:
            return state
    }
}

export default proteinVizReducer
