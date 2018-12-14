import {
    MOUSE_OVER_SAMPLE, MOUSE_OVER_REPL
} from '../actions/sampleSelection'

const initialState = {
    mouseOverSampleId: undefined
}

const sampleSelectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case MOUSE_OVER_SAMPLE:
            return { ...state, mouseOverSampleId: action.sampleIdx }
        case MOUSE_OVER_REPL:
            return { ...state, mouseOverReplId: action.replIdx }
        default:
            return state
    }
}

export default sampleSelectionReducer
