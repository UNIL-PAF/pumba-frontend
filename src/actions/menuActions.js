export const SET_LEGEND_POS = 'SET_LEGEND_POS'
export const SET_MOVE_LEGEND = 'SET_MOVE_LEGEND'
export const SHOW_OPTIONS_MENU = 'SHOW_OPTIONS_MENU'
export const SET_GEL_CONTRAST = 'SET_GEL_CONTRAST'
export const SET_PROTEIN_MENU_MAX_INTENSITY = 'SET_PROTEIN_MENU_MAX_INTENSITY'
export const SET_PEPTIDE_MENU_MAX_INTENSITY = 'SET_PEPTIDE_MENU_MAX_INTENSITY'
export const SET_SHOW_ONLY_RAZOR = 'SET_SHOW_ONLY_RAZOR'
export const SET_SHOW_ONLY_UNIQUE = 'SET_SHOW_ONLY_UNIQUE'
export const SET_ORGANISM = 'SET_ORGANISM'
export const SET_SHOW_ISOFORMS = 'SET_SHOW_ISOFORMS'

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

export const setProteinMenuMaxIntensity = (maxIntensity) => ({
    type: SET_PROTEIN_MENU_MAX_INTENSITY, maxIntensity: maxIntensity
})

export const setPeptideMenuMaxIntensity = (maxIntensity) => ({
    type: SET_PEPTIDE_MENU_MAX_INTENSITY, maxIntensity: maxIntensity
})

export const setShowOnlyRazor = (showOnlyRazor) => ({
    type: SET_SHOW_ONLY_RAZOR, showOnlyRazor: showOnlyRazor
})

export const setShowOnlyUnique = (showOnlyUnique) => ({
    type: SET_SHOW_ONLY_UNIQUE, showOnlyUnique: showOnlyUnique
})

export const setOrganism = (organism) => ({
    type: SET_ORGANISM, organism: organism
})

export const setShowIsoforms = (showIsoforms) => ({
    type: SET_SHOW_ISOFORMS, showIsoforms: showIsoforms
})