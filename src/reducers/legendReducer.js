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
            let newEntry = {}
            newEntry[action.view] =  {x: action.x, y: action.y}
            const newLegendPos = Object.assign(state.legendPos ? state.legendPos : {}, newEntry)
            return { ...state, legendPos: newLegendPos}
        case SET_MOVE_LEGEND:
            return { ...state, legendIsMoving: action.isMoving }
        default:
            return state
    }
}

export default legendReducer
