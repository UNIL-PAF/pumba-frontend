import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import { scaleLinear } from 'd3-scale'
import * as _ from 'lodash'
import { axisLeft, axisBottom } from 'd3-axis'
import {brushX} from 'd3-brush'
import { select, event } from 'd3-selection'
import { sampleColor } from '../common/colorSettings'
import TheoWeightLine from './TheoWeightLine'
import ProteinVizLegendsContainer from '../legends/ProteinVizLegendsContainer'
import ProteinMergesContainer from "./ProteinMergesContainer"
import PopOverSkeleton from "../common/popOverSkeleton"
import ProteinTitle from "../common/ProteinTitle"


class ProteinVizPlot extends Component {

    constructor(props) {
        super(props)

        const {proteinData} = this.props
        this.state = this.computeLimits(proteinData)
        this.svg = React.createRef()
        this.brushG = React.createRef()
    }

    computeLimits = (proteinData) => {
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

        return {
            xScale: scaleLinear().range([0, this.props.viewWidth - this.margin.left - this.margin.right]).domain([this.minMolWeight, this.maxMolWeight]),
            yScale: scaleLinear().range([this.props.viewHeight - this.margin.top - this.margin.bottom, 0]).domain([0, maxInt]),
            theoMolWeight: theoMolWeight,
            scaleChanged: 0,
            proteinDataTimestamp: proteinData.timestamp
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
            this.state.brush.call(brushX().move, null)
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

        const brushSelect = select(this.brushG.current)
        this.setState({brush: brushSelect})
        setTimeout( () => brushSelect.call(brushX(this.state.xScale).on('end', this.brushend)) )
    }


    getMousePos = () => {
        const {mouseX, mouseY} = this.state
        return [mouseX, mouseY]
    }


    mouseMove = (e) => {
        const {setLegendPos, legendIsMoving} = this.props

        var point = this.svg.current.createSVGPoint()
        point.x = e.clientX
        point.y = e.clientY;
        point = point.matrixTransform(this.svg.current.getScreenCTM().inverse());

        const x = point.x - this.margin.left
        const y = point.y - this.margin.top

        // move the legend
        if(legendIsMoving){
            setLegendPos("protein", x - 8, y - 5)
        }

        this.setState({mouseX: x, mouseY: y})
    }

    componentDidUpdate(){
        const {zoomLeft, zoomRight, proteinData} = this.props

        // we only update the axis and stuff if the zoom or data changed
        if(zoomLeft && this.state.zoomLeft !== zoomLeft && this.state.zoomRight !== zoomRight){
            // change the scale after zooming
            this.state.xScale.domain([zoomLeft, zoomRight]);

            // update x-axis
            const xAxis = axisBottom(this.state.xScale)
                .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

            select(this.xAxis).call(xAxis)

            const newScaleChanged = this.state.scaleChanged + 1

            // remember the current zoom state
            this.setState({zoomLeft: zoomLeft, zoomRight: zoomRight, scaleChanged: newScaleChanged})
        }

        if(this.state.proteinDataTimestamp && (this.state.proteinDataTimestamp !== proteinData.timestamp)){
            this.setState(this.computeLimits(proteinData))
            this.setState({proteinDataTimestamp: proteinData.timestamp})
        }

    }

    // set the margins
    margin = {top: 10, right: 40, bottom: 30, left: 20};


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
                {_.map(mergedData, (md, i) => {

                    // in case a sample is unselected
                    if(! proteinData[i]) return null

                    const idx = datasets[proteinData[i].sample].idx

                    // find the correct intensity
                    const curveIdx = _.findIndex(md.theoMergedProtein.theoMolWeights, (x) => {
                        return x > mouseWeightPos
                    })
                    const int = md.theoMergedProtein.intensities[curveIdx]

                    if(typeof int !== 'undefined'){
                        return <circle key={idx} className={"merged-position-circle"} cx={mouseX} cy={yScale(int) + this.margin.top} r={3} fill={sampleColor(idx)}></circle>
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
                    className={"unselecteable"}
                    x={mouseX - 18}
                    y={11}
                    fontSize={"50%"}
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
        const {viewWidth, viewHeight, mouseLeaveSampleCB, popup, proteinData, history, legendPos} = this.props

        // set the initial legend position
        const localLegendPos = (legendPos && legendPos.protein) ? legendPos.protein : {x: viewWidth-200, y: 20}

        // the mol weight at the mouse position
        const mouseWeightPos = this.state.xScale.invert(this.state.mouseX - this.margin.left)

        return <div id={"protein-plot"}>
            <svg className="protein-svg"
                 viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                 width="100%"
                 height="100%"
                 ref={this.svg}
                 onMouseMove={(e) => this.mouseMove(e)}
            >

                <g className="brush-g" ref={this.brushG} onDoubleClick={this.zoomOut}
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

                    {this.svg &&  <ProteinMergesContainer xScale={this.state.xScale} yScale={this.state.yScale} history={history}
                                                 margin={this.margin} svgParent={this.svg} scaleChanged={this.state.scaleChanged}
                                                getMousePos={this.getMousePos}>
                                </ProteinMergesContainer>}

                    <ProteinVizLegendsContainer x={localLegendPos.x} y={localLegendPos.y} width={150}
                                     theoMolWeight={this.state.theoMolWeight} parentSvg={this.svg}
                    >
                    </ProteinVizLegendsContainer>

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
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    unclickSliceCB: PropTypes.func.isRequired,
    clickSliceCB: PropTypes.func.isRequired,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    changeZoomRangeCB: PropTypes.func.isRequired,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    clickedRepl: PropTypes.array.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    popup: PropTypes.object,
    clickedSlices: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    legendPos: PropTypes.object,
    setLegendPos: PropTypes.func.isRequired,
};

export default ProteinVizPlot