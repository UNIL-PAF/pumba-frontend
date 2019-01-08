import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import { scaleLinear } from 'd3-scale'
import * as _ from 'lodash'
import { axisLeft, axisBottom } from 'd3-axis'
import { brushX } from 'd3-brush'
import { select, event } from 'd3-selection'
import { sampleColor, lightSampleColor } from '../../common/colorSettings'
import TheoWeightLine from './TheoWeightLine'
import Merged2DLegends from './Merged2DLegends'


class Merged2DPlot extends Component {

    constructor(props) {
        super(props)
        const {proteinData } = this.props

        const minMolWeightDa = Math.pow(10, _.min(_.map(proteinData, function(p){
            return p.theoMergedProtein.theoMolWeights[0]
        })))

        const maxMolWeightDa = Math.pow(10, _.max(_.map(proteinData, function(p){
            const theoMolWeights = p.theoMergedProtein.theoMolWeights
            return theoMolWeights[theoMolWeights.length - 1]
        })))

        this.marginMin = Math.log10(minMolWeightDa - 1)
        this.marginMax = Math.log10(maxMolWeightDa + 10)

        const maxInt = _.max(_.map(proteinData, function(pd){
            return _.max(_.map(pd.proteins, function(p){
                return _.max(p.intensities)
            }))
        }))

        // just take the theoretical weight of the first protein, it should always be the same.
        const theoMolWeight = Math.log10(proteinData[0].proteins[0].theoMolWeight)

        this.state = {
            xScale: scaleLinear().range([0, this.props.viewWidth - this.margin.left - this.margin.right]).domain([this.marginMin, this.marginMax]),
            yScale: scaleLinear().range([this.props.viewHeight - this.margin.top - this.margin.bottom, 0]).domain([0, maxInt]),
            theoMolWeight: theoMolWeight
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
        this.props.changeZoomRangeCB(this.marginMin, this.marginMax)
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
    }

    componentDidUpdate(){
        const {zoomLeft, zoomRight} = this.props

        // we only update the axis and stuff if the zoom changed
        if(zoomLeft && this.state.zoomLeft !== zoomLeft && this.state.zoomRight !== zoomRight){
            // change the scale after zooming
            this.state.xScale.domain([zoomLeft, zoomRight]);

            // update x-axis
            const xAxis = axisBottom(this.state.xScale)
                .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

            select(this.xAxis).call(xAxis)

            // remember the current zoom state
            this.setState({zoomLeft: zoomLeft, zoomRight: zoomRight})
        }

    }

    // set the margins
    margin = {top: 10, right: 0, bottom: 30, left: 50};

    /**
     * Give back a string with the positions of the merged protein points
     * @param theoMergedProtein
     * @returns {string}
     */
    theoPosString = (theoMergedProtein) => {
        const weightIntPairs = _.zip(theoMergedProtein.theoMolWeights, theoMergedProtein.intensities)

        const res = _.map(weightIntPairs, (p) => {
          return (this.state.xScale(p[0]) + this.margin.left) + "," + (this.state.yScale(p[1]) + this.margin.top)
        }).join(" ")

        return res
    }

    plotSliceBars = (proteins, idx, mouseOverReplId) => {
        const col = sampleColor(idx)

        return  <g key={"slice-bars-"+idx}>
            { this.plotOneProtein(proteins.proteins[mouseOverReplId], col, "slice-bar-"+idx+"-") }
        </g>
    }

    plotOneProtein = (protein, color, keyName) => {
        const {zoomLeft, zoomRight} = this.props

        const massFits = protein.dataSet.massFitResult.massFits
        const ints = protein.intensities

        // filter out entries which are not in the visual range
        const slices = _.zip(massFits, ints)
        const fltSlices = _.filter(slices, (s) => {
            return s[0] >= zoomLeft && s[0] <= zoomRight
        })

        return _.map(fltSlices, (x, i) => {
            return this.plotOneSlice(x[0], x[1], color, keyName+i)
        })
    }

    plotOneSlice = (mass, int, color, keyName) => {
        const xPos = this.state.xScale(mass) + this.margin.left

        return <line
            key={keyName}
            x1={xPos}
            y1={this.state.yScale(0) + this.margin.top}
            x2={xPos}
            y2={this.state.yScale(int) + this.margin.top}
            stroke={color}
            strokeWidth={ 2 }
        />
    }

    plotProteinMerges = () => {
        const {proteinData, mouseOverSampleId, mouseOverReplId, theoMergedProteins} = this.props

        // theoMergedProteins contain the filtered values, based on the given zoom range
        // they were filtered in the merged2DPlotActions
        const mergedData = (theoMergedProteins) ? theoMergedProteins : proteinData

        return <g>
            { _.map(mergedData, (p, i) => this.plotOneProteinMerge(p.theoMergedProtein, i, mouseOverSampleId)) }
            { mouseOverReplId !== undefined && this.plotSliceBars(proteinData[mouseOverSampleId], mouseOverSampleId, mouseOverReplId)}
        </g>
    }

    plotOneProteinMerge = (proteinMerge, idx) => {
        const sampleCol = sampleColor(idx)
        const highlight = (this.props.mouseOverSampleId === idx)

        return <polyline class="merged-plot-line" key={"prot-merge-" + idx} points={this.theoPosString(proteinMerge)}
                      stroke={sampleCol} fill="transparent" strokeWidth={ highlight ? "1.2" : "0.7" }/>
    }

    plotTheoMolWeightLine = () => {
        const {theoMolWeight, xScale, zoomLeft, zoomRight} = this.state
        const {viewHeight} = this.props

        if(!zoomLeft || (theoMolWeight >= zoomLeft && theoMolWeight <= zoomRight)){
            return <TheoWeightLine xPos={xScale(theoMolWeight) + this.margin.left} yTop={viewHeight + this.margin.top}></TheoWeightLine>
        }
    }

    render() {
        const {viewWidth, viewHeight, samples, mouseOverSampleId, mouseOverSampleCB, mouseOverReplId,
            mouseOverReplCB, mouseLeaveSampleCB, mouseLeaveReplCB, zoomLeft, zoomRight} = this.props

        return <div id={"merged-2d-plot"}>
            <svg className="merged-2d-svg"
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

                <g className="merged-2d-main-g" transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}>

                    {this.plotTheoMolWeightLine()}

                    {this.plotProteinMerges()}

                    <g className="y-axis" ref={r => this.yAxis = r}
                       transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>

                    <g className="x-axis" ref={r => this.xAxis = r}
                       transform={'translate(' + this.margin.left + ',' + (viewHeight - this.margin.bottom) + ')'}/>

                    <Merged2DLegends x={viewWidth-200} y={20} width={150} samples={samples}
                                     mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                                     mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}
                                     mouseLeaveReplCB={mouseLeaveReplCB} mouseLeaveSampleCB={mouseLeaveSampleCB}>
                    </Merged2DLegends>
                </g>

            </svg>
        </div>
    }

}

Merged2DPlot.propTypes = {
    proteinData: PropTypes.array.isRequired,
    theoMergedProteins: PropTypes.array,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
    samples: PropTypes.array.isRequired,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number,
    changeZoomRangeCB: PropTypes.func.isRequired,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number
};

export default Merged2DPlot