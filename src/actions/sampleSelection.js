export const MOUSE_OVER_SAMPLE = 'MOUSE_OVER_SAMPLE'
export const MOUSE_OVER_REPL = 'MOUSE_OVER_REPL'
export const MOUSE_LEAVE_SAMPLE = 'MOUSE_LEAVES_SAMPLE'
export const MOUSE_LEAVE_REPL = 'MOUSE_LEAVE_REPL'

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


