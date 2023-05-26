export const SET_SHOW_PUMBA_DESCRIPTION = 'SET_SHOW_PUMBA_DESCRIPTION'
export const SET_LAST_HISTORY = 'SET_LAST_HISTORY'

export const setShowPumbaDescription = (showPumbaDescription) => ({
    type: SET_SHOW_PUMBA_DESCRIPTION, showPumbaDescription: showPumbaDescription
})

export const setLastHistory = (lastHistory) => ({
    type: SET_LAST_HISTORY, lastHistory: lastHistory
})
