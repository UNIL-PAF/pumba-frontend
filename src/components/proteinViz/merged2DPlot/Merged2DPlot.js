import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import * as _ from 'lodash';
import { axisLeft, axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
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

        const marginMin = Math.log10(minMolWeightDa - 1)
        const marginMax = Math.log10(maxMolWeightDa + 10)

        const maxInt = _.max(_.map(proteinData, function(pd){
            return _.max(_.map(pd.proteins, function(p){
                return _.max(p.intensities)
            }))
        }))

        // just take the theoretical weight of the first protein, it should always be the same.
        const theoMolWeight = Math.log10(proteinData[0].proteins[0].theoMolWeight)

        this.state = {
            xScale: scaleLinear().range([0, this.props.viewWidth - this.margin.left - this.margin.right]).domain([marginMin, marginMax]),
            yScale: scaleLinear().range([this.props.viewHeight - this.margin.top - this.margin.bottom, 0]).domain([0, maxInt]),
            theoMolWeight: theoMolWeight
        }

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
    }

    // set the margins
    margin = {top: 5, right: 10, bottom: 30, left: 40};

    /**
     * Give back a string with the positions of the merged protein points
     * @param theoMergedProtein
     * @returns {string}
     */
    theoPosString = (theoMergedProtein) => {
        const weightIntPairs = _.zip(theoMergedProtein.theoMolWeights, theoMergedProtein.intensities)

        const res = _.map(weightIntPairs, (p) => {
          return this.state.xScale(p[0]) + "," + this.state.yScale(p[1])
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
        const massFits = protein.dataSet.massFitResult.massFits
        const ints = protein.intensities

        return _.map(_.zip(massFits, ints), (x, i) => {
            return this.plotOneSlice(x[0], x[1], color, keyName+i)
        })
    }

    plotOneSlice = (mass, int, color, keyName) => {
        const xPos = this.state.xScale(mass)

        return <line
            key={keyName}
            x1={xPos}
            y1={this.state.yScale(0)}
            x2={xPos}
            y2={this.state.yScale(int)}
            stroke={color}
            strokeWidth={ 2 }
        />
    }

    plotProteinMerges = (proteinData, mouseOverSampleId, mouseOverReplId) => {
        return <g>
            { _.map(proteinData, (p, i) => this.plotOneProteinMerge(p.theoMergedProtein, i, mouseOverSampleId)) }
            { mouseOverReplId !== undefined && this.plotSliceBars(proteinData[mouseOverSampleId], mouseOverSampleId, mouseOverReplId)}
        </g>
    }

    plotOneProteinMerge = (proteinMerge, idx) => {
        const sampleCol = sampleColor(idx)
        const highlight = (this.props.mouseOverSampleId === idx)

        return <polyline key={"prot-merge-" + idx} points={this.theoPosString(proteinMerge)}
                      stroke={sampleCol} fill="transparent" strokeWidth={ highlight ? "1.2" : "0.7" }/>
    }

    render() {
        const {proteinData, viewWidth, viewHeight, samples, mouseOverSampleId, mouseOverSampleCB, mouseOverReplId,
            mouseOverReplCB, mouseLeaveSampleCB, mouseLeaveReplCB} = this.props
        const {theoMolWeight, xScale} = this.state

        return <div id={"merged-2d-plot"}>
            <svg className="merged-2d-svg"
                 viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                 width="100%"
                 height="100%"
                 ref={r => this.svg = r}
                 //position="fixed"
                 //preserveAspectRatio='none'
            >
                <rect x={0} y={0} width={viewWidth} height={viewHeight} fill={"white"} onMouseEnter={() => mouseLeaveSampleCB()}>
                </rect>

                <g className="y-axis" ref={r => this.yAxis = r}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                <g className="x-axis" ref={r => this.xAxis = r}
                   transform={'translate(' + this.margin.left + ',' + (viewHeight - this.margin.bottom) + ')'}/>

                <g className="merged-2d-main-g" transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}>

                    <TheoWeightLine xPos={xScale(theoMolWeight)} yTop={viewHeight}></TheoWeightLine>

                    {this.plotProteinMerges(proteinData, mouseOverSampleId, mouseOverReplId)}

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
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
    samples: PropTypes.array.isRequired,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number
};

export default Merged2DPlot