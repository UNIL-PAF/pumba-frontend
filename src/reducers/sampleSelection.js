import {
    MOUSE_OVER_SAMPLE, MOUSE_OVER_REPL, MOUSE_LEAVE_SAMPLE, MOUSE_LEAVE_REPL, MOUSE_CLICK_REPL, REMOVE_REPL
} from '../actions/sampleSelection'
import * as _ from 'lodash';

const initialState = {
    mouseOverSampleId: undefined, mouseOverReplId: undefined, clickedRepl: []
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
        case MOUSE_CLICK_REPL:
            const alreadyThere = _.some(state.clickedRepl, (x) => {
                return x.sampleIdx === action.sampleIdx && x.replIdx === action.replIdx
            })
            const newEntry = {sampleIdx: action.sampleIdx, replIdx: action.replIdx}
            const clickedRepl = alreadyThere ? state.clickedRepl : state.clickedRepl.concat(newEntry)
            return { ...state, clickedRepl: clickedRepl}
        case REMOVE_REPL:
            const clickedReplRemoved = _.filter(state.clickedRepl, (x) => {
                return x.sampleIdx !== action.sampleIdx || x.replIdx !== action.replIdx
            })
            return { ...state, clickedRepl: clickedReplRemoved}
        default:
            return state
    }
}

export default sampleSelectionReducer
