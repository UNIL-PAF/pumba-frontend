import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash';
import {interpolateHsl} from 'd3-interpolate'

class DatasetGelSlice extends PureComponent {

    plotDataset = () =>{
        const {datasetData, sliceHeight, sliceWidth, xPos, yPos, yScale, maxInt, amplify, greyScale} = this.props

        const arrLength = datasetData.massFits.length
        const yPositions = _.map(datasetData.massFits, (m) => {return yScale(m)})

        const getLimitLower = (i) => {
            if(i === arrLength-1) {
                return sliceHeight
            }else{
                const h = (yPositions[i+1] - yPositions[i]) / 2
                return (yPositions[i] + h)
            }
        }

        const getLimitUpper = (i) => {
            if(i === 0) {
                return 0
            }else{
                const h = (yPositions[i] - yPositions[i-1]) / 2
                return (yPositions[i] - h)
            }
        }

        return _.reduceRight(datasetData.intensities, (res, intensity, i) => {
            if(intensity > 0){
                const upperLimit = getLimitUpper(i)
                const lowerLimit = getLimitLower(i)
                const colVal = (intensity / maxInt) * amplify
                const corrCol = greyScale(colVal > 1 ? 1 : colVal)
                const rectStyle = {fill: corrCol, stroke: corrCol, strokeWidth: 0.4}

                const rect = <rect
                    key={'orig-slice-' + i}
                    width={sliceWidth}
                    height={lowerLimit - upperLimit}
                    transform={'translate(' + xPos + ',' + (yPos + upperLimit) + ')'}
                    style={rectStyle}
                    >
                    </rect>

                res.push(rect)
            }
            return res
        }, [])
    }

    render() {
        return <g>
            {this.plotDataset()}
        </g>
    }
}

DatasetGelSlice.propTypes = {
    datasetData: PropTypes.object.isRequired,
    sliceWidth: PropTypes.number.isRequired,
    sliceHeight: PropTypes.number.isRequired,
    xPos: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    maxInt: PropTypes.number.isRequired,
    yScale: PropTypes.func.isRequired,
    amplify: PropTypes.number.isRequired,
    greyScale: PropTypes.func.isRequired

};

export default DatasetGelSlice