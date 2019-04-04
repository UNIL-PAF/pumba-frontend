import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import { scaleLinear } from 'd3-scale'
import * as _ from 'lodash'
import { axisLeft, axisBottom } from 'd3-axis'
import {brushX} from 'd3-brush'
import { select, event, mouse } from 'd3-selection'
import { sampleColor } from '../common/colorSettings'
import TheoWeightLine from './TheoWeightLine'
import ProteinVizLegends from './ProteinVizLegends'
import ProteinMerges from "./ProteinMerges"
import PopOverSkeleton from "../common/popOverSkeleton"
import ProteinTitle from "../common/ProteinTitle"


class ProteinVizPlot extends Component {

    constructor(props) {
        super(props)

        const {proteinData} = this.props

        const minMolWeightDa = Math.pow(10, _.min(_.map(proteinData, function(p){
            return p.theoMergedProtein.theoMolWeights[0]
        })))

        const maxMolWeightDa = Math.pow(10, _.max(_.map(proteinData, function(p){
            const theoMolWeights = p.theoMergedProtein.theoMolWeights
            return theoMolWeights[theoMolWeights.length - 1]
        })))

        this.minMolWeight = Math.log10(minMolWeightDa - 1)
        this.maxMolWeight = Math.log10(maxMolWeightDa + 10)

        const maxInt = _.max(_.map(proteinData, function(pd){
            return _.max(_.map(pd.proteins, function(p){
                return _.max(p.intensities)
            }))
        }))

        // just take the theoretical weight of the first protein, it should always be the same.
        const theoMolWeight = Math.log10(proteinData[0].proteins[0].theoMolWeight)

        this.state = {
            xScale: scaleLinear().range([0, this.props.viewWidth - this.margin.left - this.margin.right]).domain([this.minMolWeight, this.maxMolWeight]),
            yScale: scaleLinear().range([this.props.viewHeight - this.margin.top - this.margin.bottom, 0]).domain([0, maxInt]),
            theoMolWeight: theoMolWeight,
            scaleChanged: 0
        }
    }

    brushend = () => {
        // look for a d3 event
        var s = event.selection;
        if(s){

            // if there is an event we take its coordinates and remove the margin
            const newDomain = _.map(s, (x) => { return this.state.xScale.invert(x - this.margin.left) })

            // dispatch the new zoom
            this.props.changeZoomRangeCB(newDomain[0], newDomain[1])

            // remove the brush area
            this.brushG.call(brushX().move, null)
        }
    }

    zoomOut = () => {
        // reset the original zoom
        this.props.changeZoomRangeCB(this.minMolWeight, this.maxMolWeight)
    }

    componentDidMount(){
        // add the x-axis
        const xAxis = axisBottom(this.state.xScale)
            .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

        select(this.xAxis).call(xAxis)

        const yAxis = axisLeft(this.state.yScale)
            .tickFormat((d) => { return d.toExponential() })

        select(this.yAxis)
            .call(yAxis)

        setTimeout( () => this.brushG.call(brushX(this.state.xScale).on('end', this.brushend)) )

        // set the mouseX position
        this.brushG.on('mousemove', () => {
            const x = mouse(this.svg)[0]
            const xWithoutMargin = x - this.margin.left
            this.setState({mouseX: xWithoutMargin})
        })

        // we have to update after the "this.svg" has been set
        this.forceUpdate()
    }

    componentDidUpdate(){
        const {zoomLeft, zoomRight} = this.props

        // we only update the axis and stuff if the zoom or data changed
        if(zoomLeft && this.state.zoomLeft !== zoomLeft && this.state.zoomRight !== zoomRight){
            // change the scale after zooming
            this.state.xScale.domain([zoomLeft, zoomRight]);

            // update x-axis
            const xAxis = axisBottom(this.state.xScale)
                .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

            select(this.xAxis).call(xAxis)

            // a helper variable to force the update of ProteinMerges after the scale changed
            const newScaleChanged = this.state.scaleChanged + 1

            // remember the current zoom state
            this.setState({zoomLeft: zoomLeft, zoomRight: zoomRight, scaleChanged: newScaleChanged})
        }
    }

    // set the margins
    margin = {top: 10, right: 0, bottom: 30, left: 0};


    plotTheoMolWeightLine = () => {
        const {theoMolWeight, xScale, zoomLeft, zoomRight} = this.state
        const {viewHeight} = this.props

        if(!zoomLeft || (theoMolWeight >= zoomLeft && theoMolWeight <= zoomRight)){
            return <TheoWeightLine xPos={xScale(theoMolWeight) + this.margin.left} yTop={viewHeight + this.margin.top}></TheoWeightLine>
        }
    }

    plotMousePositionCircles = (mouseWeightPos) => {
        const {proteinData, theoMergedProteins, datasets} = this.props
        const mergedData = (theoMergedProteins) ? theoMergedProteins : proteinData
        const {mouseX, yScale} = this.state

        return <g>
                {_.map(mergedData, (md, idx) => {
                    // find the correct intensity
                    const curveIdx = _.findIndex(md.theoMergedProtein.theoMolWeights, (x) => {
                        return x > mouseWeightPos
                    })
                    const int = md.theoMergedProtein.intensities[curveIdx]

                    if(typeof int !== 'undefined'){
                        return <circle key={idx} className={"merged-position-circle"}
                                       cx={mouseX} cy={yScale(int) + this.margin.top}
                                       r={3} fill={sampleColor(datasets[proteinData[idx].sample].idx)}>
                        </circle>
                    }
                })}
            </g>
    }

    plotMousePositionLine = (mouseWeightPos) => {
        const {mouseX} = this.state
        const {viewHeight} = this.props
        const rectWidth = 50

        if(mouseX){
            return <g>
                <line
                    className={"mouse-pos-line"}
                    x1={mouseX}
                    y1={0}
                    x2={mouseX}
                    y2={viewHeight + this.margin.top}
                    stroke={"lightgrey"}
                    strokeWidth={ 0.5 }
                ></line>
                <rect
                    x={mouseX - (rectWidth/2)}
                    y={0}
                    width={rectWidth}
                    height={this.margin.bottom - this.margin.top - 4}
                    fill={"white"}
                    stroke={"grey"}
                    strokeWidth={1}
                    rx={3}
                    ry={3}
                ></rect>
                <text
                    x={mouseX - 18}
                    y={11}
                    fontSize={"10px"}
                    fontFamily={"sans-serif"}
                >{Math.round(Math.pow(10, mouseWeightPos)) + " kDa"}</text>
            </g>
        }

    }

    plotPopup = () => {
        const {x, y, content} = this.props.popup

        const height = 60

        return (
            <PopOverSkeleton x={x+5} y={y-height} width={120} height={height} content={content} removable={false}/>
        )
    }

    render() {
        const {viewWidth, viewHeight, samples, mouseOverSampleId, mouseOverSampleCB, mouseOverReplId,
            mouseOverReplCB, mouseLeaveSampleCB, mouseLeaveReplCB, mouseClickReplCB, clickedRepl,
            removeSelectedReplCB, popup, proteinData, theoMergedProteins, unclickSliceCB, clickSliceCB,
            zoomRight, zoomLeft, showPopupCB, removePopupCB, clickedSlices, history, datasets} = this.props

        // the mol weight at the mouse position
        const mouseWeightPos = this.state.xScale.invert(this.state.mouseX)

        return <div id={"protein-plot"}>
            <svg className="protein-svg"
                 viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                 width="100%"
                 height="100%"
                 ref={r => this.svg = r}
                 //position="fixed"
                 //preserveAspectRatio='none'
            >

                <g className="brush-g" ref={r => this.brushG = select(r)} onDoubleClick={this.zoomOut}
                   onMouseEnter={() => mouseLeaveSampleCB()}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/> }

                <g className="protein-main-g" transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}>

                    {this.plotTheoMolWeightLine()}

                    <ProteinTitle proteinData={proteinData}/>

                    {this.plotMousePositionCircles(mouseWeightPos)}

                    <g className="y-axis" ref={r => this.yAxis = r}
                       transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>

                    <g className="x-axis" ref={r => this.xAxis = r}
                       transform={'translate(' + this.margin.left + ',' + (viewHeight - this.margin.bottom) + ')'}/>

                    {this.plotMousePositionLine(mouseWeightPos)}

                    {this.svg &&  <ProteinMerges proteinData={proteinData} theoMergedProteins={theoMergedProteins}
                                                 unclickSliceCB={unclickSliceCB} clickSliceCB={clickSliceCB}
                                                 mouseOverSampleId={mouseOverSampleId} mouseOverReplId={mouseOverReplId}
                                                 zoomLeft={zoomLeft} zoomRight={zoomRight} clickedRepl={clickedRepl}
                                                 showPopupCB={showPopupCB} removePopupCB={removePopupCB} popup={popup}
                                                 clickedSlices={clickedSlices} history={history} xScale={this.state.xScale}
                                                 yScale={this.state.yScale} margin={this.margin} svgParent={this.svg}
                                                 scaleChanged={this.state.scaleChanged} datasets={datasets}>
                                </ProteinMerges>}

                    <ProteinVizLegends x={viewWidth-200} y={20} width={150} samples={samples}
                                     mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                                     mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}
                                     mouseLeaveReplCB={mouseLeaveReplCB} mouseLeaveSampleCB={mouseLeaveSampleCB}
                                     theoMolWeight={this.state.theoMolWeight} mouseClickReplCB={mouseClickReplCB}
                                     clickedRepl={clickedRepl} removeSelectedReplCB={removeSelectedReplCB}
                                     datasets={datasets}
                    >
                    </ProteinVizLegends>

                    {popup && this.plotPopup()}
                </g>

            </svg>
        </div>
    }
}

ProteinVizPlot.propTypes = {
    proteinData: PropTypes.array.isRequired,
    theoMergedProteins: PropTypes.array,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
    samples: PropTypes.array.isRequired,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    unclickSliceCB: PropTypes.func.isRequired,
    clickSliceCB: PropTypes.func.isRequired,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number,
    changeZoomRangeCB: PropTypes.func.isRequired,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    clickedRepl: PropTypes.array.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    popup: PropTypes.object,
    clickedSlices: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired
};

export default ProteinVizPlot