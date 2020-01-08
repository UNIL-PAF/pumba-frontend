export const SET_LEGEND_POS = 'SET_LEGEND_POS'
export const SET_MOVE_LEGEND = 'SET_MOVE_LEGEND'
export const SHOW_OPTIONS_MENU = 'SHOW_OPTIONS_MENU'
export const SET_GEL_CONTRAST = 'SET_GEL_CONTRAST'

export const setLegendPos = (view, x, y) => ({
    type: SET_LEGEND_POS, view: view, x: x, y: y
})

export const setMoveLegend = (isMoving) => ({
    type: SET_MOVE_LEGEND, isMoving: isMoving
})

export const showOptionsMenu = (page) => ({
    type: SHOW_OPTIONS_MENU, page: page
})

export const setGelContrast = (gelContrast) => ({
    type: SET_GEL_CONTRAST, gelContrast: gelContrast
})

