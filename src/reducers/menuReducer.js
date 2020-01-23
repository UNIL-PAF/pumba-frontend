import {
    SET_LEGEND_POS,
    SET_MOVE_LEGEND
} from '../actions/legendActions'
import {
    SET_GEL_CONTRAST, SET_PROTEIN_MENU_MAX_INTENSITY, SET_SHOW_ONLY_RAZOR, SET_SHOW_ONLY_UNIQUE,
    SHOW_OPTIONS_MENU
} from "../actions/menuActions";
import pumbaConfig from '../config'

const initialState = {
    legendPos: null,
    legendIsMoving: false,
    selectedOption: undefined,
    gelContrast: pumbaConfig.initialGelContrast,
    maxIntensity: undefined,
    showOnlyRazor: false,
    showOnlyUnique: false
}

const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LEGEND_POS:
            let newEntry = {}
            newEntry[action.view] =  { x: action.x, y: action.y }
            const newLegendPos = Object.assign(state.legendPos ? state.legendPos : {}, newEntry)
            return { ...state, legendPos: newLegendPos }
        case SET_MOVE_LEGEND:
            return { ...state, legendIsMoving: action.isMoving }
        case SHOW_OPTIONS_MENU:
            return { ...state, selectedOption: action.page }
        case SET_GEL_CONTRAST:
            return { ...state, gelContrast: action.gelContrast }
        case SET_PROTEIN_MENU_MAX_INTENSITY:
            return { ...state, proteinMenuMaxIntensity: action.proteinMenuMaxIntensity }
        case SET_SHOW_ONLY_RAZOR:
            return { ...state, showOnlyRazor: action.showOnlyRazor }
        case SET_SHOW_ONLY_UNIQUE:
            return { ...state, showOnlyUnique: action.showOnlyUnique }
        default:
            return state
    }
}

export default menuReducer