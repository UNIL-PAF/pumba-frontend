import {
    SET_LEGEND_POS,
    SET_MOVE_LEGEND
} from '../actions/legendActions'

const initialState = {
    legendPos: null,
    legendIsMoving: false
}

const legendReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LEGEND_POS:
            return { ...state, legendPos: {x: action.x, y: action.y} }
        case SET_MOVE_LEGEND:
            return { ...state, legendIsMoving: action.isMoving }
        default:
            return state
    }
}

export default legendReducer
