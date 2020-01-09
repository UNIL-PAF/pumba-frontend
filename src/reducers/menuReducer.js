import {
    SET_LEGEND_POS,
    SET_MOVE_LEGEND
} from '../actions/legendActions'
import {SET_GEL_CONTRAST, SHOW_OPTIONS_MENU} from "../actions/menuActions";

const initialState = {
    legendPos: null,
    legendIsMoving: false,
    selectedOption: undefined,
    gelContrast: 15
}

const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LEGEND_POS:
            let newEntry = {}
            newEntry[action.view] =  {x: action.x, y: action.y}
            const newLegendPos = Object.assign(state.legendPos ? state.legendPos : {}, newEntry)
            return { ...state, legendPos: newLegendPos}
        case SET_MOVE_LEGEND:
            return { ...state, legendIsMoving: action.isMoving }
        case SHOW_OPTIONS_MENU:
            return { ...state, selectedOption: action.page }
        case SET_GEL_CONTRAST:
            return { ...state, gelContrast: action.gelContrast }
        default:
            return state
    }
}

export default menuReducer
