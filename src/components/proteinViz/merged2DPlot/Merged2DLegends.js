import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import LegendField from './LegendField'
import TheoWeightLine from './TheoWeightLine'
import * as _ from 'lodash';
import { sampleColor, lightSampleColor } from '../../common/colorSettings'

class Merged2DLegends extends Component {

    // we need the legendIdx to get the right positions of the legends when expanding the replicates
    legendIdx = 1

    componentDidMount(){
        this.legendIdx = 1
    }

    componentDidUpdate(){
        this.legendIdx = 1
    }

    /**
     * plot the symbol for the theo weight line
     */
    theoMolSymbol = (x, y, height) => {
        return <TheoWeightLine xPos={x} yTop={y} height={height}>
        </TheoWeightLine>
    }

    /**
     * plot the sample dots
     */
    sampleSymbol = (x, y, height, idx, mouseOverSampleIdx) => {
        const highlight = (idx === mouseOverSampleIdx)
        return <circle cx={x} cy={y-height/3} r={height/6} fill={sampleColor(idx)} strokeWidth={(highlight) ? 3 : 0.5} stroke={"black"}>
        </circle>
    }

    /**
     *
     */
    replSymbol = (x, y, height, idx, mouseOverReplIdx, sampleIdx) => {
        const highlight = (idx === mouseOverReplIdx)

        return <line
        x1={x}
        y1={y}
        x2={x}
        y2={y-height+10}
        stroke={ highlight ? sampleColor(sampleIdx) : lightSampleColor(sampleIdx) }
        strokeWidth={ highlight ? 2 : 1 }
        />
    }

    plotReplicate = (repl, x, y, width, height, sampleIdx, mouseOverReplId, mouseOverReplCB) => {
        const {idx, name } = repl
        this.legendIdx = this.legendIdx + 1

       const res = <LegendField
            key={"replicate-legend-" + idx}
            onMouseOver={mouseOverReplCB}
            mouseOverId={mouseOverReplId}
            idx={idx}
            sampleIdx={sampleIdx}
            x={x+5} y={y+(this.legendIdx)*height} width={width} height={height}
            text={name} legend={this.replSymbol}>
        </LegendField>



        return res
    }

    plotSample = (sample, x, y, width, height, mouseOverSampleCB, mouseOverSampleId, mouseOverReplId, mouseOverReplCB) => {
        const {idx, name } = sample

        const res =  <g key={"sample-legend-" + idx}>
                <LegendField
                    onMouseOver={mouseOverSampleCB}
                    mouseOverId={mouseOverSampleId}
                    idx={idx}
                    x={x} y={y+(this.legendIdx)*height} width={width} height={height}
                    text={name} legend={this.sampleSymbol}>
                </LegendField>
                { (idx === mouseOverSampleId) && _.map(sample.replicates, (repl) => this.plotReplicate(repl, x, y, width, height, idx, mouseOverReplId, mouseOverReplCB)) }
        </g>

        this.legendIdx = this.legendIdx + 1

        return res
    }

    render() {
        const { x, y, width, samples, mouseOverSampleCB, mouseOverSampleId, mouseOverReplId, mouseOverReplCB} = this.props;

        const legendHeight = 20

        return <g>
            <rect
                className="merged-legends-box"
                x={x}
                y={y}
                width={width}
                height={100}
                fill={"white"}
                stroke={"grey"}
                strokeWidth={1}
            />

            <LegendField
                x={x} y={y} width={width} height={legendHeight}
                text={"Theo Mol Weight"} legend={this.theoMolSymbol}>
            </LegendField>

            <g>{_.map(samples, (s) => this.plotSample(s, x, y, width, legendHeight, mouseOverSampleCB, mouseOverSampleId, mouseOverReplId, mouseOverReplCB))
            })}</g>

        </g>

    }
}

Merged2DLegends.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    samples: PropTypes.array.isRequired,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired
};

export default (Merged2DLegends);