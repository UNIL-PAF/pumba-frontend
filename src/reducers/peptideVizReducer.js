import {
    CHANGE_PEP_ZOOM_RANGE, REMOVE_PEP_POPUP, RESET_PEPTIDE_VIEW, SHOW_PEP_POPUP,
} from '../actions/peptideVizActions'

const initialState = {
    zoom: undefined,
    popup: undefined
}

const peptideVizReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_PEP_ZOOM_RANGE:

            const newZoomRange = {
                left: action.left,
                right: action.right,
                top: action.top,
                bottom: action.bottom
            }

            return {...state, zoom: (action.left ? newZoomRange : undefined) }
        case SHOW_PEP_POPUP:
            return { ...state, popup: action.popup}
        case REMOVE_PEP_POPUP:
            return { ...state, popup: undefined}
        case RESET_PEPTIDE_VIEW:
            return initialState
        default:
            return state
    }
}

export default peptideVizReducer
