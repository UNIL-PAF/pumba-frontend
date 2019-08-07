export const SET_LEGEND_POS = 'SET_LEGEND_POS'
export const SET_MOVE_LEGEND = 'SET_MOVE_LEGEND'

export const setLegendPos = (x, y) => ({
    type: SET_LEGEND_POS, x: x, y: y
})

export const setMoveLegend = (isMoving) => ({
    type: SET_MOVE_LEGEND, isMoving: isMoving
})