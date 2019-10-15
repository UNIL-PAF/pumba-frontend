import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import {scaleLinear} from "d3-scale";
import {axisBottom, axisLeft} from "d3-axis";
import {select} from "d3-selection";
import * as _ from 'lodash';


class GelSlice extends PureComponent {





    render() {
        const {viewWidth, viewHeight, dataset} = this.props

        return <g className="gel-slice" key={dataset.sample}>
                    <g>
                        <text x={50} y={50}>coucou</text>
                    </g>
            </g>
    }

}

GelSlice.propTypes = {
    proteinData: PropTypes.array.isRequired,
    dataset: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
};

export default GelSlice