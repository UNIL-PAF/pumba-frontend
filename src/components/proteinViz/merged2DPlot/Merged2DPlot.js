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


class Merged2DPlot extends Component {

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
            xScale: scaleLinear().range([0, this.props.width - this.margin.left - this.margin.right]).domain([marginMin, marginMax]),
            yScale: scaleLinear().range([this.props.height - this.margin.top - this.margin.bottom, 0]).domain([0, maxInt]),
            theoMolWeight: theoMolWeight
        }

    }


    componentDidMount(){
        // add the x-axis
        const xAxis = axisBottom(this.state.xScale)
            .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

        select(this.xAxis).call(xAxis)

        const yAxis = axisLeft(this.state.yScale)

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

    plotSliceBars = (proteins, idx) => {
        const lightSampleCol = lightSampleColor(idx)

        return <g key={"splice-bars-"+idx}>
            {_.map(proteins, (p, i) => {
                return this.plotOneProtein(p, lightSampleCol, "splice-bar-"+idx+"-"+i+"-")
            })}
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
            strokeWidth={1}
        />
    }

    plotProteinMerges = (proteinData) => {
        return <g>
            { _.map(proteinData, (p, i) => this.plotSliceBars(p.proteins, i)) }
            { _.map(proteinData, (p, i) => this.plotOneProteinMerge(p.theoMergedProtein, i)) }
        </g>
    }

    plotOneProteinMerge = (proteinMerge, idx) => {
        const sampleCol = sampleColor(idx)

        return <polyline key={"prot-merge-" + idx} points={this.theoPosString(proteinMerge)}
                      stroke={sampleCol} fill="transparent" strokeWidth="1"/>
    }

    render() {
        const {proteinData, width, height} = this.props
        const {theoMolWeight, xScale} = this.state

        return <div>
            <svg className="merged-2d-svg"
                 viewBox={`0 0 ${width} ${height}`}
                 position="fixed"
                 width="100%"
                 height="100%"
                 ref={r => this.svg = r}
            >
                <g className="y-axis" ref={r => this.yAxis = r}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                <g className="x-axis" ref={r => this.xAxis = r}
                   transform={'translate(' + this.margin.left + ',' + (height - this.margin.bottom) + ')'}/>
                <g className="merged-2d-main-g" transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}>
                    <TheoWeightLine xPos={xScale(theoMolWeight)} yTop={height}></TheoWeightLine>
                    {this.plotProteinMerges(proteinData)}
                </g>
            </svg></div>
    }

}

Merged2DPlot.propTypes = {
    proteinData: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};

export default Merged2DPlot