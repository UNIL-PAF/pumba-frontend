export const MOUSE_OVER_SAMPLE = 'MOUSE_OVER_SAMPLE'
export const MOUSE_OVER_REPL = 'MOUSE_OVER_REPL'

export const mouseOverSample = (sampleIdx) => ({
    type: MOUSE_OVER_SAMPLE, sampleIdx: sampleIdx
})

export const mouseOverRepl = (replIdx) => ({
    type: MOUSE_OVER_REPL, replIdx: replIdx
})

