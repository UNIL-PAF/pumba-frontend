import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import GelSlice from "../gelViz/GelSlice"
import * as _ from 'lodash';
import {scaleLinear} from "d3-scale";
import {axisLeft} from "d3-axis";
import {select} from "d3-selection";


class GelViz extends PureComponent {

    // set the margins
    margin = {top: 5, right: 10, bottom: 40, left: 40}

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
            theoMolWeight: theoMolWeight
        }
    }

    componentDidMount(){
        // add the y-axis
        const yAxis = axisLeft(this.state.yScale)
            .tickValues([1, 1.204119982655925, 1.397940008672038, 1.602059991327962, 1.812913356642856, 2, 2.204119982655925,2.397940008672038,2.602059991327962,2.778151250383644])
            .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })
            //.tickValues([1, 2, 3, 5, 8, 13, 21]);

        const yAxisSelect = select(this.yAxis.current)
        yAxisSelect.call(yAxis)
    }


    plotOneGel = (datasetName) => {
        const {proteinData, datasets} = this.props

        const subProteinData = _.filter(proteinData, (p) => p.sample === datasetName)
        const dataset = datasets[datasetName]

        console.log(subProteinData)
        console.log(dataset)
        console.log(datasetName)

        return <GelSlice
                key={'gel-slice-' + datasetName}
                proteinData={subProteinData}
                dataset={dataset}
                width={10}
                >
                </GelSlice>
    }

    render() {
        const {proteinData, datasets, datasetNames, viewWidth, viewHeight} = this.props

        console.log(proteinData)
        console.log(datasets)

        return  <div id={"gel-plot"}>
                    <svg className="gel-svg"
                         viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                         width="100%"
                         height="100%"
                    >
                        <g className="gel-y-axis" ref={this.yAxis} transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                        {_.map(datasetNames, (datasetName) => {return this.plotOneGel(datasetName)})}
                    </svg>
                </div>
    }

}

GelViz.propTypes = {
    proteinData: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    datasetNames: PropTypes.array.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
};

export default GelViz