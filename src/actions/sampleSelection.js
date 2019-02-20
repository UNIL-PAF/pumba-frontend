export const MOUSE_OVER_SAMPLE = 'MOUSE_OVER_SAMPLE'
export const MOUSE_OVER_REPL = 'MOUSE_OVER_REPL'
export const MOUSE_LEAVE_SAMPLE = 'MOUSE_LEAVES_SAMPLE'
export const MOUSE_LEAVE_REPL = 'MOUSE_LEAVE_REPL'
export const MOUSE_CLICK_REPL = 'MOUSE_CLICK_REPL'
export const REMOVE_REPL = 'REMOVE_REPL'
export const CLICK_SLICE = 'CLICK_SLICE'
export const UNCLICK_SLICE = 'UNCLICK_SLICE'
export const RESET_SAMPLE_SELECTION = 'RESET_SAMPLE_SELECTION'

export const mouseOverSample = (sampleIdx) => ({
    type: MOUSE_OVER_SAMPLE, sampleIdx: sampleIdx
})

export const mouseOverRepl = (replIdx) => ({
    type: MOUSE_OVER_REPL, replIdx: replIdx
})

export const mouseLeaveSample = () => ({
    type: MOUSE_LEAVE_SAMPLE
})

export const mouseLeaveRepl = () => ({
    type: MOUSE_LEAVE_REPL
})

export const mouseClickRepl = (sampleIdx, replIdx) => ({
    type: MOUSE_CLICK_REPL, sampleIdx: sampleIdx, replIdx: replIdx
})

export const removeRepl = (sampleIdx, replIdx) => ({
    type: REMOVE_REPL, sampleIdx: sampleIdx, replIdx: replIdx
})

export const clickSlice = (slice) => ({
    type: CLICK_SLICE, slice: slice
})

export const unclickSlice = (slice) => ({
    type: UNCLICK_SLICE, slice: slice
})

export const resetSampleSelection = () => ({
    type: RESET_SAMPLE_SELECTION
})
