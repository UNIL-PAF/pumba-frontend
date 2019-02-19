export const CHANGE_PEP_ZOOM_RANGE = 'CHANGE_PEP_ZOOM_RANGE'
export const SHOW_PEP_POPUP = 'SHOW_PEP_POPUP'
export const REMOVE_PEP_POPUP = 'REMOVE_PEP_POPUP'

export const changePepZoomRange = (left, right, top, bottom) => ({
    type: CHANGE_PEP_ZOOM_RANGE, left: left, right: right, top: top, bottom: bottom
})

export const showPepPopup = (popup) => ({
    type: SHOW_PEP_POPUP, popup: popup
})

export const removePepPopup = () => ({
    type: REMOVE_PEP_POPUP
})


