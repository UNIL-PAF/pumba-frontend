import {
    CHANGE_ZOOM_RANGE,
    CHANGE_THEO_MERGED_PROTEINS
} from '../actions/merged2DPlotActions'

const initialState = {
    zoomLeft: undefined,
    zoomRight: undefined,
    theoMergedProteins: null
}

const merged2DPlotReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_ZOOM_RANGE:
            return { ...state, zoomLeft: action.left, zoomRight: action.right }
        case CHANGE_THEO_MERGED_PROTEINS:
            return { ...state, theoMergedProteins: action.theoMergedProteins}
        default:
            return state
    }
}

export default merged2DPlotReducer
