import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import { scaleLinear } from 'd3-scale'
import { select, event } from 'd3-selection'
import {axisBottom, axisLeft} from "d3-axis";
import {brush} from "d3-brush";
import * as _ from 'lodash'
import AminoAcidBar from './AminoAcidBar'
import Peptide from './Peptide'
import ProteinVizLegends from '../proteinViz/ProteinVizLegends'
import PopOverSkeleton from "../common/popOverSkeleton"
import ProteinTitle from "../common/ProteinTitle"

class PeptideViz extends Component {

    constructor(props) {
        super(props)

        const {proteinData, viewWidth, viewHeight} = this.props

        const minMolWeightDa = Math.pow(10, _.min(_.map(proteinData, function(p){
            return p.theoMergedProtein.theoMolWeights[0]
        })))

        const maxMolWeightDa = Math.pow(10, _.max(_.map(proteinData, function(p){
            const theoMolWeights = p.theoMergedProtein.theoMolWeights
            return theoMolWeights[theoMolWeights.length - 1]
        })))

        this.minMolWeight = Math.log10(minMolWeightDa - 1)
        this.maxMolWeight = Math.log10(maxMolWeightDa + 10)
        this.yRange = this.maxMolWeight - this.minMolWeight

        // just take the theoretical weight of the first protein, it should always be the same.
        const theoMolWeight = Math.log10(proteinData[0].proteins[0].theoMolWeight)

        // get the molWeights for each slice for each sample
        const sliceMolWeight = _.flatMap(proteinData, (oneSample) => {
            return _.map(oneSample.proteins, (protein) => {
                return protein.dataSet.massFitResult.massFits
            })
        })

        this.state = {
            xScale: scaleLinear().range([0, viewWidth - this.margin.left - this.margin.right]),
            yScale: scaleLinear().range([viewHeight - this.margin.top - this.margin.bottom, 0]),
            theoMolWeight: theoMolWeight,
            sliceMolWeight: sliceMolWeight
        }
    }

    // set the margins
    margin = {top: 5, right: 10, bottom: 30, left: 40};


    componentDidMount(){
        // add the y-axis
        const yAxis = axisLeft(this.state.yScale)
            .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

        select(this.yAxis).call(yAxis)

        const xAxis = axisBottom(this.state.xScale)

        select(this.xAxis)
            .call(xAxis)

        setTimeout( () => this.brushG.call(brush(this.state.xScale, this.state.yScale).on('end', this.brushend)) )

        // we have to update after the "this.svg" has been set
        this.forceUpdate()
    }

    componentDidUpdate(){
        const {zoom, sequenceData} = this.props

        const zoomLeft = (zoom === undefined) ? 1 : zoom.left;
        const zoomRight = (zoom === undefined) ? sequenceData.length : zoom.right;
        const zoomTop = (zoom === undefined) ? this.minMolWeight : zoom.top
        const zoomBottom = (zoom === undefined) ? this.maxMolWeight : zoom.bottom

        // we only update the axis and stuff if the zoom changed
        if(zoomLeft && this.state.zoomLeft !== zoomLeft && this.state.zoomRight !== zoomRight){
            // change the scale after zooming
            this.state.xScale.domain([zoomLeft, zoomRight]);
            this.state.yScale.domain([zoomTop, zoomBottom])

            // update y-axis
            const yAxis = axisLeft(this.state.yScale)
                .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })
            select(this.yAxis).call(yAxis)

            // and x-axis
            const xAxis = axisBottom(this.state.xScale)
            select(this.xAxis)
                .call(xAxis)

            // remember the current zoom state
            this.setState({zoomLeft: zoomLeft, zoomRight: zoomRight})
        }

        // TODO: update scales only if new data was loaded

    }

    brushend = () => {
        var s = event.selection;
        if(s){
            const xZoom = _.map(s, (a) => {
                return this.state.xScale.invert(a[0])
            });

            const yZoom = _.reverse(_.map(s, (a) => {
                return this.state.yScale.invert(a[1])
            }));


            this.props.changeZoomRangeCB(xZoom[0], xZoom[1], yZoom[0], yZoom[1])

            // remove the brush area
            this.brushG.call(brush().move, null)
        }
    }

    zoomOut = () => {
        this.props.changeZoomRangeCB(undefined, undefined, undefined, undefined)
    }

    plotAminAcidBar = (thisZoomLeft, thisZoomRight) => {
        const {viewHeight, sequenceData} = this.props

        return <AminoAcidBar
            zoomLeft={thisZoomLeft}
            zoomRight={thisZoomRight}
            sequence={sequenceData.sequence}
            xScale={this.state.xScale}
            yPos={viewHeight - this.margin.bottom + 18}
        />
    }

    plotPeptides = (thisZoomLeft, thisZoomRight, yZoomFactor) => {
        const {proteinData, clickedRepl, clickedSlices, mouseOverSampleId, mouseOverReplId,
            showPopupCB, removePopupCB} = this.props

        // we need this variable to get the correct replIdx
        var replIdx = 0;

        return proteinData.map((sample, i) => {
            return sample.proteins.map((protein, j) => {
                replIdx = replIdx + 1

                const fltProt = _.filter(protein.peptides, (pep) => {
                    return pep.endPos > thisZoomLeft && pep.startPos < thisZoomRight
                })

                const sliceFromReplIsClicked = _.some(clickedSlices, (slice) => {
                    return sample.sample === slice.sample && protein.dataSet.name === slice.replicate
                })

                return fltProt.map((peptide, k) => {

                    // check if given replicate is activated on proteinViz
                    const replIsClicked = _.some(clickedRepl, (x) => {
                        return x.sampleIdx === i && x.replIdx === j
                    })

                    const sliceIsClicked = _.some(clickedSlices, (slice) => {
                        return sliceFromReplIsClicked & (slice.idx+1) === peptide.sliceNr
                    })

                    const highlightRepl = (i === mouseOverSampleId && j === mouseOverReplId)

                    return <Peptide
                        xScale={this.state.xScale}
                        yScale={this.state.yScale}
                        sampleIdx={i}
                        replIdx={replIdx-1}
                        svgParent={this.svg}
                        sliceMolWeight={this.state.sliceMolWeight}
                        pepInfo={peptide}
                        yZoomFactor={yZoomFactor}
                        key={i+':'+j+':'+k}
                        highlightRepl={replIsClicked || highlightRepl}
                        sliceIsClicked={sliceIsClicked}
                        showPopupCB={showPopupCB}
                        removePopupCB={removePopupCB}
                    />
                })
            })
        })
    }

    plotPopup = () => {
        const {x, y, content} = this.props.popup

        const seqLen = content.Sequence.length
        const height = 90
        const defWidth = 130
        const width = seqLen > 11 ? (seqLen - 11) * 5 + defWidth : defWidth

        return (
            <PopOverSkeleton x={x+5} y={y-height} width={width} height={height} content={content} removable={false}/>
        )
    }

    plotTheoWeightLine = () => {
        const {yScale, theoMolWeight} = this.state

        const y = yScale(theoMolWeight)

        return <line
            className="theo-weight-line"
            x1={0}
            y1={y}
            x2={this.props.viewWidth}
            y2={ y }
        />
    }

    render(){
        const {viewWidth, viewHeight, zoom, sequenceData, samples, clickedRepl, mouseOverSampleCB, mouseOverReplId,
            mouseOverReplCB, mouseLeaveReplCB, mouseLeaveSampleCB, mouseClickReplCB, removeSelectedReplCB, mouseOverSampleId,
            popup, proteinData} = this.props

        const zoomLeft = (zoom === undefined) ? 1 : zoom.left;
        const zoomRight = (zoom === undefined) ? sequenceData.length : zoom.right;
        const zoomTop = (zoom === undefined) ? this.maxMolWeight : zoom.top
        const zoomBottom = (zoom === undefined) ? this.minMolWeight : zoom.bottom

        // change the scale after zooming
        this.state.xScale.domain([zoomLeft, zoomRight])
        this.state.yScale.domain([zoomTop, zoomBottom])

        // compute the current factor of yZoom
        const yZoomFactor = this.yRange / (zoomTop - zoomBottom)

        return <div id={"peptide-plot"}>
            <svg className="peptide-svg"
                 viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                 width="100%"
                 height="100%"
                 ref={r => this.svg = r}
            >
                <g className="pep-y-axis" ref={r => this.yAxis = r}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                <g className="pep-x-axis" ref={r => this.xAxis = r}
                   transform={'translate(' + this.margin.left + ',' + (viewHeight - this.margin.bottom) + ')'}/>
                <g className="brush-g" ref={r => this.brushG = select(r)} onDoubleClick={this.zoomOut}
                   onMouseEnter={() => mouseLeaveSampleCB()}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                <g className="peptide-viz-g"
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}
                   onDoubleClick={this.zoomOut}
                >
                    { this.plotTheoWeightLine() }
                    <ProteinTitle proteinData={proteinData}/>
                    { this.plotAminAcidBar(zoomLeft, zoomRight) }
                    { this.svg && this.plotPeptides(zoomLeft, zoomRight, yZoomFactor) }
                </g>
                <ProteinVizLegends x={viewWidth-200} y={20} width={150} samples={samples}
                                   theoMolWeight={this.state.theoMolWeight} clickedRepl={clickedRepl}
                                   mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                                   mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}
                                   mouseLeaveReplCB={mouseLeaveReplCB} mouseLeaveSampleCB={mouseLeaveSampleCB}
                                   mouseClickReplCB={mouseClickReplCB} removeSelectedReplCB={removeSelectedReplCB}
                >
                </ProteinVizLegends>
                {popup && this.plotPopup()}
            </svg>
        </div>
    }

}

PeptideViz.propTypes = {
    proteinData: PropTypes.array.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
    zoom: PropTypes.object,
    changeZoomRangeCB: PropTypes.func,
    clickedRepl: PropTypes.array.isRequired,
    clickedSlices: PropTypes.array.isRequired,
    samples: PropTypes.array.isRequired,
    sequenceData: PropTypes.object,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    popup: PropTypes.object,
};

export default (PeptideViz)

