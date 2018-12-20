import {
    MOUSE_OVER_SAMPLE, MOUSE_OVER_REPL ,MOUSE_LEAVE_SAMPLE
} from '../actions/sampleSelection'

const initialState = {
    mouseOverSampleId: undefined, mouseOverReplId: undefined
}

const sampleSelectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case MOUSE_OVER_SAMPLE:
            return { ...state, mouseOverSampleId: action.sampleIdx }
        case MOUSE_LEAVE_SAMPLE:
            return { ...state, mouseOverSampleId: undefined, mouseOverReplId: undefined }
        case MOUSE_OVER_REPL:
            return { ...state, mouseOverReplId: action.replIdx }
        default:
            return state
    }
}

export default sampleSelectionReducer
