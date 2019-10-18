import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import GelSlice from "./GelSlice"
import * as _ from 'lodash';
import {scaleLinear} from "d3-scale";
import {axisLeft} from "d3-axis";
import {select} from "d3-selection";
import {interpolateHsl} from "d3-interpolate";

class GelViz extends PureComponent {

    // set the margins
    margin = {top: 100, right: 10, bottom: 40, left: 40}
    sliceWidth = 40
    sliceSpacing = 10

    // TODO put a slider
    amplify = 5

    // grey scale
    greyScale = interpolateHsl("#FAFAFA", "#444444")

    constructor(props) {
        super(props)

        const {proteinData, viewHeight} = this.props

        this.yAxis = React.createRef()

        const minMolWeightDa = Math.pow(10, _.min(_.map(proteinData, function(p){
            return p.theoMergedProtein.theoMolWeights[0]
        })))

        const maxMolWeightDa = Math.pow(10, _.max(_.map(proteinData, function(p){
            const theoMolWeights = p.theoMergedProtein.theoMolWeights
            return theoMolWeights[theoMolWeights.length - 1]
        })))

        const minMolWeight = Math.log10(minMolWeightDa - 1)
        const maxMolWeight = Math.log10(maxMolWeightDa + 10)

        // just take the theoretical weight of the first protein, it should always be the same.
        const theoMolWeight = Math.log10(proteinData[0].proteins[0].theoMolWeight)

        this.state = {
            yScale: scaleLinear().range([viewHeight - this.margin.top - this.margin.bottom, 0]).domain([minMolWeight, maxMolWeight]),
            theoMolWeight: theoMolWeight,
            proteinDataTimestamp: proteinData.timestamp,
            maxInt: this.getMaxInt()
        }
    }

    componentDidMount(){
        // add the y-axis
        const yAxis = axisLeft(this.state.yScale)
            .tickValues([1, 1.204119982655925, 1.397940008672038, 1.602059991327962, 1.812913356642856, 2, 2.204119982655925,2.397940008672038,2.602059991327962,2.778151250383644])
            .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

        const yAxisSelect = select(this.yAxis.current)
        yAxisSelect.call(yAxis)
    }

    componentDidUpdate(){
        const {proteinData} = this.props

        if(this.state.proteinDataTimestamp && (this.state.proteinDataTimestamp !== proteinData.timestamp)){
            this.setState({maxInt: this.getMaxInt()})
        }
    }

    getMaxInt = () => {
        return _.max(_.map(this.props.proteinData, function(pd){
            return _.max(_.map(pd.proteins, function(p){
                return _.max(p.intensities)
            }))
        }))
    }

    plotMergedGel = (thisProteinData, title, slicePos) => {
        const {viewHeight} = this.props

        const mergedData = { molWeights: thisProteinData.theoMergedProtein.theoMolWeights, intensities: thisProteinData.theoMergedProtein.intensities}

        return <GelSlice
            key={'gel-slice-' + title}
            title={title}
            sliceWidth={this.sliceWidth}
            sliceHeight={viewHeight - this.margin.top - this.margin.bottom}
            xPos={slicePos * (this.sliceWidth + this.sliceSpacing) + this.margin.left + 10}
            yPos={this.margin.top}
            yScale={this.state.yScale}
            maxInt={this.state.maxInt}
            mergedData={mergedData}
            amplify={this.amplify}
            greyScale={this.greyScale}
        >
        </GelSlice>
    }

    plotOrigGel = (activeDatasets, thisProteinData, slicePos) => {
        const {viewHeight} = this.props

        return _.map(activeDatasets, (dataset, k) => {
            const selData = _.find(thisProteinData.proteins, (p) => { return p.dataSet.id === dataset.id})
            const datasetData = {massFits: selData.dataSet.massFitResult.massFits, intensities: selData.intensities}

            console.log()

            return <GelSlice
                key={'gel-slice-' + dataset.name}
                title={dataset.sample}
                subTitle={dataset.name}
                sliceWidth={this.sliceWidth}
                sliceHeight={viewHeight - this.margin.top - this.margin.bottom}
                xPos={(slicePos + k) * (this.sliceWidth + this.sliceSpacing) + this.margin.left + 10}
                yPos={this.margin.top}
                yScale={this.state.yScale}
                maxInt={this.state.maxInt}
                datasetData={datasetData}
                amplify={this.amplify}
                greyScale={this.greyScale}
            >
            </GelSlice>
        })
    }


    plotGels = () => {
        const {datasets, proteinData} = this.props

        const activeDatasets = _.filter(datasets, 'isActive')
        let slicePos = 0

        return _.map(activeDatasets, (dataset) => {
            const thisProteinData = _.find(proteinData, (p) => { return p.sample === dataset.name})
            const activeDatasets = _.filter(dataset.datasets, 'isActive')

            const origSlicePos = slicePos
            slicePos += (1 + activeDatasets.length)

            return <g key={'slice-group-' + dataset.name}>
                {this.plotMergedGel(thisProteinData, dataset.name, origSlicePos)}
                {this.plotOrigGel(activeDatasets, thisProteinData, origSlicePos + 1)}
            </g>

        })
    }

    render() {
        const {viewWidth, viewHeight} = this.props

        return  <div id={"gel-plot"}>
                    <svg className="gel-svg"
                         viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                         width="100%"
                         height="100%"
                    >
                        <g className="gel-y-axis" ref={this.yAxis} transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                        {this.plotGels()}
                    </svg>
                </div>
    }

}

GelViz.propTypes = {
    proteinData: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
};

export default GelViz