import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import {scaleLinear} from "d3-scale";
import {axisBottom, axisLeft} from "d3-axis";
import {select} from "d3-selection";
import * as _ from 'lodash';

class GelSlice extends PureComponent {

    plotTheoMergedProtein = () =>{
        const {proteinData} = this.props

        console.log(proteinData.theoMergedProtein)
        const a =  _.map(_.range(proteinData.theoMergedProtein.theoMolWeights.length), (i) => {
            return [proteinData.theoMergedProtein.theoMolWeights[i], proteinData.theoMergedProtein.intensities[i]]
        })
        console.log(a)

    }

    render() {
        const {dataset, xPos, yPos, sliceWidth, sliceHeight, proteinData} = this.props

        console.log(proteinData)
        console.log(dataset)

        const rectStyle = {fill: '#FAFAFA'}

        this.plotTheoMergedProtein()

        return <g key={'gel-slice-' + dataset.sample}>
                    <rect
                        width={sliceWidth}
                        height={sliceHeight}
                        transform={'translate(' + xPos + ',' + yPos + ')'}
                        style={rectStyle}
                    >
                    </rect>
                </g>
    }


}

GelSlice.propTypes = {
    proteinData: PropTypes.array.isRequired,
    dataset: PropTypes.object.isRequired,
    sliceWidth: PropTypes.number.isRequired,
    sliceHeight: PropTypes.number.isRequired,
    xPos: PropTypes.number.isRequired,
    xPos: PropTypes.number.isRequired,
};

export default GelSlice