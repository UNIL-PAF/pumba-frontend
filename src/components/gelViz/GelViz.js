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
import { sampleColor } from '../common/colorSettings'
import ExpandCollapsInfo from "./ExpandCollapsInfo";

class GelViz extends PureComponent {

    // set the margins
    margin = {top: 60, right: 10, bottom: 40, left: 40}
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
        this.svg = React.createRef()

        const minMolWeightDa = Math.pow(10, _.min(_.map(proteinData, function(p){
            return p.theoMergedProtein.theoMolWeights[0]
        })))

        const maxMolWeightDa = Math.pow(10, _.max(_.map(proteinData, function(p){
            const theoMolWeights = p.theoMergedProtein.theoMolWeights
            return theoMolWeights[theoMolWeights.length - 1]
        })))

        const minMolWeight = Math.log10(minMolWeightDa - 1)
        const maxMolWeight = Math.log10(maxMolWeightDa + 10)

        this.yScale = scaleLinear().range([viewHeight - this.margin.top - this.margin.bottom, 0]).domain([minMolWeight, maxMolWeight])

        // just take the theoretical weight of the first protein, it should always be the same.
        this.theoMolWeight = proteinData[0].proteins[0].theoMolWeight
        this.theoMolWeightPos = this.yScale(Math.log10(proteinData[0].proteins[0].theoMolWeight)) + this.margin.top

        this.state = {
            proteinDataTimestamp: proteinData.timestamp,
            maxInt: this.getMaxInt()
        }
    }

    componentDidMount(){
        // add the y-axis
        const yAxis = axisLeft(this.yScale)
            .tickValues([1, 1.204119982655925, 1.397940008672038, 1.602059991327962, 1.812913356642856, 2, 2.204119982655925,2.397940008672038,2.602059991327962,2.778151250383644])
            .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

        const yAxisSelect = select(this.yAxis.current)
        yAxisSelect.call(yAxis)
    }

    componentDidUpdate(){
        const {proteinData} = this.props

        if(this.state.proteinDataTimestamp && (this.state.proteinDataTimestamp !== proteinData.timestamp)){
            this.setState({maxInt: this.getMaxInt()})

            // just take the theoretical weight of the first protein, it should always be the same.
            this.theoMolWeight = proteinData[0].proteins[0].theoMolWeight
            this.theoMolWeightPos = this.yScale(Math.log10(proteinData[0].proteins[0].theoMolWeight)) + this.margin.top

        }
    }

    getMaxInt = () => {
        return _.max(_.map(this.props.proteinData, function(pd){
            return _.max(_.map(pd.proteins, function(p){
                return _.max(p.intensities)
            }))
        }))
    }

    onMouseEnterMerged = (sampleId) => {
        this.setState({mouseEnteredSample: sampleId})
    }

    onMouseLeaveMerged = () => {
        this.setState({mouseEnteredSample: undefined})
    }

    mouseMove = (e) => {
        var point = this.svg.current.createSVGPoint()
        point.x = e.clientX
        point.y = e.clientY;
        point = point.matrixTransform(this.svg.current.getScreenCTM().inverse());

        const x = point.x - this.margin.left
        const y = point.y - this.margin.top

        this.setState({mouseX: x, mouseY: y})
    }

    getMousePos = () => {
        const {mouseX, mouseY} = this.state
        return [mouseX, mouseY]
    }

    plotMergedGel = (thisProteinData, title, slicePos, sampleName, containsSelected) => {
        const {viewHeight, mouseClickSampleCB} = this.props

        return <g>
                <GelSlice
                key={'gel-slice-' + title}
                title={title}
                subTitle={'Merged'}
                sliceWidth={this.sliceWidth}
                sliceHeight={viewHeight - this.margin.top - this.margin.bottom}
                xPos={slicePos * (this.sliceWidth + this.sliceSpacing) + this.margin.left + 10}
                yPos={this.margin.top}
                yScale={this.yScale}
                maxInt={this.state.maxInt}
                mergedData={thisProteinData.shortMergedData}
                amplify={this.amplify}
                greyScale={this.greyScale}
                mouseClickCB={mouseClickSampleCB}
                sampleName={sampleName}
                onMouseEnterCB={() => {this.onMouseEnterMerged(sampleName)}}
                onMouseLeaveCB={() => {this.onMouseLeaveMerged()}}
            >
            </GelSlice>
            {(this.state.mouseEnteredSample === sampleName) && this.plotExpandInfo(thisProteinData, title, slicePos, sampleName, containsSelected)}
        </g>
    }

    plotOrigGels = (datasets, thisProteinData, slicePos, sampleName) => {
        const {viewHeight, mouseClickReplCB} = this.props

        let localPos = 0

        return _.map(datasets, (dataset, k) => {
            if(! dataset.isSelected){
                return null
            }

            const selData = _.find(thisProteinData.proteins, (p) => { return p.dataSet.id === dataset.id})
            const datasetData = {massFits: selData.dataSet.massFitResult.massFits, intensities: selData.intensities}

            const gelPlot =  <GelSlice
                key={'gel-slice-' + dataset.name}
                title={''}
                subTitle={dataset.name}
                sliceWidth={this.sliceWidth}
                sliceHeight={viewHeight - this.margin.top - this.margin.bottom}
                xPos={(slicePos + localPos) * (this.sliceWidth + this.sliceSpacing) + this.margin.left + 10}
                yPos={this.margin.top}
                yScale={this.yScale}
                maxInt={this.state.maxInt}
                datasetData={datasetData}
                amplify={this.amplify}
                greyScale={this.greyScale}
                mouseClickReplCB={mouseClickReplCB}
                sampleName={sampleName}
                replId={dataset.id}
                getMousePos={this.getMousePos}
            >
            </GelSlice>

            localPos += 1
            return gelPlot
        })
    }

    plotSampleRect = (slicePos, nrSelectedDatasets, datasetId) => {
        const {viewHeight} = this.props

        const sliceSize = this.sliceWidth + this.sliceSpacing
        return  <rect
                x={slicePos * sliceSize + this.margin.left+6}
                y={this.margin.top}
                rx={3}
                ry={3}
                width={(1+nrSelectedDatasets) * sliceSize - 2}
                height={viewHeight - this.margin.top - this.margin.bottom}
                fill={"none"}
                stroke={sampleColor(datasetId)}
                >
                </rect>
    }

    plotExpandInfo = (thisProteinData, title, slicePos, sampleName, containsSelected) => {
        const {viewHeight} = this.props

        return <ExpandCollapsInfo
            xPos={slicePos * (this.sliceWidth + this.sliceSpacing) + this.margin.left + 10}
            yPos={viewHeight - this.margin.bottom + 10}
            showExpand={! containsSelected}
        />
    }

    plotGels = () => {
        const {datasets, proteinData} = this.props
        const activeDatasets = _.filter(datasets, 'isActive')
        let slicePos = 0

        return _.map(activeDatasets, (dataset) => {
            const thisProteinData = _.find(proteinData, (p) => { return p.sample === dataset.name})

            // return null if there is no data
            if(! thisProteinData) return null
            //
            const nrSelectedDatasets = _.reduce(dataset.datasets, (acc2, d2) => {return (d2.isSelected ? 1 : 0) + acc2}, 0)

            const plots =  <g key={'slice-group-' + dataset.name}>
                {this.plotMergedGel(thisProteinData, dataset.name, slicePos, dataset.name, nrSelectedDatasets > 0)}
                {nrSelectedDatasets && this.plotOrigGels(dataset.datasets, thisProteinData, slicePos+1, dataset.name)}
                {nrSelectedDatasets && this.plotSampleRect(slicePos, nrSelectedDatasets, dataset.idx)}
            </g>

            slicePos += (1 +  nrSelectedDatasets)
            return plots
        })
    }

    plotTheoMolWeight = (totalSlicesWidth) => {

        const xPos = totalSlicesWidth + this.margin.left + 20

        return <g>
            <line
                className={"theo-line-gel"}
                x1={this.margin.left}
                y1={this.theoMolWeightPos}
                x2={xPos}
                y2={this.theoMolWeightPos}
                stroke={"red"}
                strokeWidth={ 1 }
            ></line>
            <text className={'gel-theo-molweight-text'} x={xPos} y={this.theoMolWeightPos}>{this.theoMolWeight + ' kDa'}</text>
        </g>
    }

    render() {
        const {viewWidth, viewHeight, datasets} = this.props

        const nrSlices = _.reduce(datasets, (acc, d) => {
            const selectedDatasets = (d.isActive ? _.reduce(d.datasets, (acc2, d2) => {return (d2.isSelected ? 1 : 0) + acc2}, 0) : 0)
            return acc + selectedDatasets + 1
        }, 0)

        const totalSlicesWidth = nrSlices * (this.sliceWidth + this.sliceSpacing)

        return  <div id={"gel-plot"}>
                    <svg className="gel-svg"
                         viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                         width="100%"
                         height="100%"
                         ref={this.svg}
                         onMouseMove={(e) => this.mouseMove(e)}
                    >
                        <g className="gel-y-axis" ref={this.yAxis} transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                        {this.plotGels()}
                        {this.plotTheoMolWeight(totalSlicesWidth)}
                    </svg>
                </div>
    }

}

GelViz.propTypes = {
    proteinData: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
    mouseClickSampleCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired
};

export default GelViz