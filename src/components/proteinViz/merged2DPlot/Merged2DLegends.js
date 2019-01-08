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
        return <TheoWeightLine xPos={x} yTop={y} height={height+10}>
        </TheoWeightLine>
    }

    /**
     * plot the sample dots
     */
    sampleSymbol = (x, y, height, idx, mouseOverSampleIdx) => {
        const highlight = (idx === mouseOverSampleIdx)
        return <circle cx={x} cy={y-height/3} r={(highlight) ? height/4 : height/6} fill={sampleColor(idx)} strokeWidth={(highlight) ? 1 : 0.5} stroke={"black"}>
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

    plotReplicate = (repl, x, y, height, sampleIdx) => {
        const {idx, name } = repl
        this.legendIdx = this.legendIdx + 1
        const {mouseOverReplId, mouseOverReplCB, width} = this.props

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

    mouseOverSample = (sampleId) => {
        this.props.mouseLeaveReplCB()
        this.props.mouseOverSampleCB(sampleId)
    }

    plotSample = (sample, x, y, height) => {
        const {width, mouseOverSampleId} = this.props

        const {idx, name } = sample

        const res =  <g key={"sample-legend-" + idx}>
                <LegendField
                    onMouseOver={this.mouseOverSample}
                    mouseOverId={mouseOverSampleId}
                    idx={idx}
                    x={x} y={y+(this.legendIdx)*height} width={width} height={height}
                    text={name} legend={this.sampleSymbol}>
                </LegendField>
                { (idx === mouseOverSampleId) && _.map(sample.replicates, (repl) => this.plotReplicate(repl, x, y, height, idx)) }
        </g>

        this.legendIdx = this.legendIdx + 1

        return res
    }

    plotTheoMolWeight = (x, y, legendHeight) => {
        return  <LegendField
            x={x} y={y} width={this.props.width} height={legendHeight}
            onMouseOver={this.props.mouseLeaveSampleCB}
            text={"Theo Mol Weight"} legend={this.theoMolSymbol}>
        </LegendField>
    }

    render() {
        const { x, y, width, samples, mouseOverSampleId} = this.props;

        const legendHeight = 20
        const nrLegends = samples.length + (mouseOverSampleId !== undefined ? samples[mouseOverSampleId].replicates.length : 0)
        const xShift = 10
        const yShift = 10

        return <g>
            <rect
                className="merged-legends-box"
                x={x}
                y={y}
                width={width + 20}
                height={nrLegends * legendHeight + 40}
                fill={"white"}
                stroke={"grey"}
                strokeWidth={1}
            />

            { this.plotTheoMolWeight(x + xShift, y+yShift, legendHeight) }

            <g>{_.map(samples, (s) => this.plotSample(s, x+xShift, y+yShift, legendHeight))
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
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired
};

export default (Merged2DLegends);