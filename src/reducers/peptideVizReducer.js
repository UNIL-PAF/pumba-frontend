import {
    CHANGE_PEP_ZOOM_RANGE,
} from '../actions/peptideVizActions'

const initialState = {
    zoom: undefined
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
        default:
            return state
    }
}

export default peptideVizReducer
