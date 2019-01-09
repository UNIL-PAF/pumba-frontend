import { schemeCategory10 } from 'd3-scale-chromatic';

// prepare the colors for the samples
let sampleColor = (sampleIdx) => { return schemeCategory10[sampleIdx] }

export { sampleColor }