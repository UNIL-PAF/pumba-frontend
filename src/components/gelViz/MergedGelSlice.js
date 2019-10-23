import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash';
import {interpolateGreys} from 'd3-scale-chromatic'

class MergedGelSlice extends PureComponent {

    plotTheoMergedProtein = () =>{
        const {mergedData, sliceHeight, sliceWidth, xPos, yPos, yScale, maxInt, amplify, greyScale} = this.props

        const rectHeight = sliceHeight / mergedData.molWeights.length
        const zippedData = _.zip(mergedData.molWeights, mergedData.intensities)
        const fltData = _.filter(zippedData, (d) => { return d[1] > 0 })

        return _.map(fltData, (d, i) => {
            const rectY = yPos + yScale(d[0])
            const colVal = (d[1] / maxInt) * amplify
            const corrColVal = greyScale(colVal > 1 ? 1 : colVal)
            const rectStyle = {
                fill: corrColVal,
                stroke: corrColVal,
                strokeWidth: 0.1,
                pointerEvents: 'none'
            }

            return <rect
                key={'theo-slice-' + i}
                width={sliceWidth}
                height={rectHeight}
                transform={'translate(' + xPos + ',' + rectY + ')'}
                style={rectStyle}
            >
            </rect>
        })
    }

    render() {
        return <g>
            {this.plotTheoMergedProtein()}
        </g>
    }


}

MergedGelSlice.propTypes = {
    mergedData: PropTypes.object.isRequired,
    sliceWidth: PropTypes.number.isRequired,
    sliceHeight: PropTypes.number.isRequired,
    xPos: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    maxInt: PropTypes.number.isRequired,
    yScale: PropTypes.func.isRequired,
    amplify: PropTypes.number.isRequired,
    greyScale: PropTypes.func.isRequired

};

export default MergedGelSlice