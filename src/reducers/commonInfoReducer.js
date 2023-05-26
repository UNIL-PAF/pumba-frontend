import {
    SET_SHOW_PUMBA_DESCRIPTION
} from '../actions/commonInfo'

const initialState = {
    showPumbaDescription: true
}

const commonInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SHOW_PUMBA_DESCRIPTION:
            return { ...state, showPumbaDescription: action.showPumbaDescription }
        default:
            return state
    }
}

export default commonInfoReducer
