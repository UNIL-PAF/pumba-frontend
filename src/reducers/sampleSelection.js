import {
    MOUSE_OVER_SAMPLE, MOUSE_OVER_REPL, MOUSE_LEAVE_SAMPLE, MOUSE_LEAVE_REPL, UNCLICK_SLICE, CLICK_SLICE, RESET_SAMPLE_SELECTION
} from '../actions/sampleSelection'
import * as _ from 'lodash';

const initialState = {
    mouseOverSampleId: undefined,
    mouseOverReplId: undefined,
    clickedSlices: []
}

const sampleSelectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case MOUSE_OVER_SAMPLE:
            return { ...state, mouseOverSampleId: action.sampleIdx }
        case MOUSE_LEAVE_SAMPLE:
            return { ...state, mouseOverSampleId: undefined, mouseOverReplId: undefined }
        case MOUSE_OVER_REPL:
            return { ...state, mouseOverReplId: action.replIdx }
        case MOUSE_LEAVE_REPL:
            return { ...state, mouseOverReplId: undefined }
        case CLICK_SLICE:
            const sliceAlready = _.some(state.clickedSlices, (x) => { return x.tag === action.slice.tag })
            return { ...state, clickedSlices: sliceAlready ? state.clickedSlices : state.clickedSlices.concat(action.slice) }
        case UNCLICK_SLICE:
            const clickedSliceRemoved = _.filter(state.clickedSlices, (x) => { return x.tag !== action.slice.tag })
            return { ...state, clickedSlices: clickedSliceRemoved}
        case RESET_SAMPLE_SELECTION:
            return initialState
        default:
            return state
    }
}

export default sampleSelectionReducer
