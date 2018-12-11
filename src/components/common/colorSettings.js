import { schemeSet1, schemePastel1 } from 'd3-scale-chromatic';

// prepare the colors for the samples
let sampleColor = (sampleIdx) => { return schemeSet1[sampleIdx] }
let lightSampleColor = (sampleIdx) => { return schemePastel1[sampleIdx] }

export { sampleColor, lightSampleColor }