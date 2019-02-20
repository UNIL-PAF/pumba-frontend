import {
    CHANGE_ZOOM_RANGE,
    CHANGE_THEO_MERGED_PROTEINS,
    SHOW_SLICE_POPUP,
    REMOVE_SLICE_POPUP, RESET_PROTEIN_VIEW
} from '../actions/proteinVizActions'

const initialState = {
    zoomLeft: undefined,
    zoomRight: undefined,
    theoMergedProteins: null,
    popup: undefined
}

const proteinVizReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_ZOOM_RANGE:
            return { ...state, zoomLeft: action.left, zoomRight: action.right }
        case CHANGE_THEO_MERGED_PROTEINS:
            return { ...state, theoMergedProteins: action.theoMergedProteins}
        case SHOW_SLICE_POPUP:
            return { ...state, popup: action.popup}
        case REMOVE_SLICE_POPUP:
            return { ...state, popup: undefined}
        case RESET_PROTEIN_VIEW:
            return initialState
        default:
            return state
    }
}

export default proteinVizReducer
