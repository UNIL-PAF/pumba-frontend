import {
    SET_SHOW_PUMBA_DESCRIPTION,
    SET_LAST_HISTORY
} from '../actions/commonInfo'

const initialState = {
    showPumbaDescription: true,
    lastHistory: undefined
}

const commonInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SHOW_PUMBA_DESCRIPTION:
            return { ...state, showPumbaDescription: action.showPumbaDescription }
        case SET_LAST_HISTORY:
            return { ...state, lastHistory: action.lastHistory }

        default:
            return state
    }
}

export default commonInfoReducer
