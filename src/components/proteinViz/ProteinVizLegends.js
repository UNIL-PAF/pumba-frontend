import React, {
    PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import LegendField from './LegendField'
import TheoWeightLine from './TheoWeightLine'
import * as _ from 'lodash';
import { sampleColor } from '../common/colorSettings'

class ProteinVizLegends extends PureComponent {

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
        return <TheoWeightLine xPos={x} yTop={y-1} height={height+10}>
        </TheoWeightLine>
    }

    /**
     * plot the sample dots
     */
    sampleSymbol = (x, y, height, idx, mouseOverSampleIdx, sampleIdx, colorIdx) => {
        const highlight = (sampleIdx === mouseOverSampleIdx)
        return <circle cx={x} cy={y-height/3} r={(highlight) ? height/4 : height/6} fill={sampleColor(colorIdx)} >
        </circle>
    }

    /**
     *
     */
    replSymbol = (x, y, height, idx, mouseOverReplIdx, sampleIdx, colorIdx, isSelected) => {
        const highlight = (idx === mouseOverReplIdx)

        return <line
        x1={x}
        y1={y-2}
        x2={x}
        y2={y-height+10}
        stroke={sampleColor(colorIdx)}
        strokeWidth={ (highlight || isSelected) ? 2 : 0.5 }
        />
    }

    mouseOverReplicate = (sampleIdx, replIdx) => {
        const {mouseOverReplCB} = this.props

        this.mouseOverSample(sampleIdx)
        mouseOverReplCB(replIdx)
    }

    plotReplicate = (repl, x, y, height, sampleIdx, colorIdx) => {
        const {idx, name } = repl
        this.legendIdx = this.legendIdx + 1
        const {mouseOverReplId, mouseOverSampleId, width, mouseClickReplCB, clickedRepl, removeSelectedReplCB} = this.props

        // check if it is selected
        const isSelected = _.some(clickedRepl, (x) => {return x.sampleIdx === sampleIdx && x.replIdx === idx})

       const res = <LegendField
            key={idx}
            clickeablePointer={true}
            mouseClickReplCB={mouseClickReplCB}
            removeSelectedReplCB={removeSelectedReplCB}
            onMouseOver={this.mouseOverReplicate}
            mouseOverId={(sampleIdx === mouseOverSampleId) ? mouseOverReplId : undefined}
            idx={idx}
            sampleIdx={sampleIdx}
            colorIdx={colorIdx}
            isSelected={isSelected}
            x={x+5} y={y+(this.legendIdx)*height} width={width} height={height}
            text={name} legend={this.replSymbol}
            isUnactiveable={true}
       >
        </LegendField>

        return res
    }

    mouseOverSample = (sampleId) => {
        this.props.mouseLeaveReplCB()
        this.props.mouseOverSampleCB(sampleId)
    }

    plotSample = (sample, x, y, height) => {
        const {width, mouseOverSampleId, clickedRepl, datasets} = this.props
        const sampleIdx = sample.idx
        const sampleName = sample.name
        const isSampleSelected = _.some(clickedRepl, (x) => {return x.sampleIdx === sampleIdx})
        const colorIdx = datasets[sampleName].idx

        const res =  <g key={sampleIdx}>
                <LegendField
                    onMouseOver={this.mouseOverSample}
                    mouseOverId={mouseOverSampleId}
                    sampleIdx={sampleIdx}
                    colorIdx={colorIdx}
                    x={x} y={y+(this.legendIdx)*height} width={width} height={height}
                    text={sampleName} legend={this.sampleSymbol}
                    isUnactiveable={true}
                >
                </LegendField>
                { (sampleIdx === mouseOverSampleId || isSampleSelected) && _.map(sample.replicates, (repl) => this.plotReplicate(repl, x, y, height, sampleIdx, colorIdx)) }
        </g>

        this.legendIdx = this.legendIdx + 1

        return res
    }

    plotTheoMolWeight = (x, y, legendHeight) => {
        const {width, mouseLeaveSampleCB, theoMolWeight} = this.props

        return  <LegendField
            x={x} y={y} width={width} height={legendHeight}
            onMouseOver={mouseLeaveSampleCB}
            text={"Theo Mol Weight (" + Math.pow(10, theoMolWeight).toFixed(2) + " kDa)"}
            legend={this.theoMolSymbol}
            isUnactiveable={false}
        >
        </LegendField>
    }

    render() {
        const { x, y, width, samples, mouseOverSampleId, clickedRepl} = this.props;

        const legendHeight = 20
        const selectedSampleIdx = _.countBy(clickedRepl, "sampleIdx")
        const mouseOverReplNr = (mouseOverSampleId !== undefined && (! selectedSampleIdx[mouseOverSampleId])) ? samples[mouseOverSampleId].replicates.length : 0
        const nrLegends = samples.length + mouseOverReplNr + _.reduce(selectedSampleIdx, (res, v, k) => {return res + samples[k].replicates.length}, 0)
        const xShift = 12
        const yShift = 10

        return <g>
            <rect
                className="merged-legends-box"
                x={x}
                y={y}
                rx={5}
                ry={5}
                width={width + 20}
                height={nrLegends * legendHeight + 40}
                fill={"white"}
                stroke={"grey"}
                strokeWidth={1}
            />

            { this.plotTheoMolWeight(x + xShift, y+yShift, legendHeight) }

            <g>{_.map(samples, (s) => this.plotSample(s, x+xShift, y+yShift, legendHeight))}</g>

        </g>

    }
}

ProteinVizLegends.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    samples: PropTypes.array.isRequired,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    theoMolWeight: PropTypes.number.isRequired,
    clickedRepl: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
};

export default (ProteinVizLegends);