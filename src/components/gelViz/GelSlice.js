import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'


class GelSlice extends PureComponent {

    render() {
        const {viewWidth, viewHeight} = this.props

        return <div className="gel-slice">
                <svg className="gel-svg"
                     viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                     width="100%"
                     height="100%"
                >
                    <g>
                        <text x={50} y={50}>coucou</text>
                    </g>
                </svg>
            </div>
    }

}

GelSlice.propTypes = {
    proteinData: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
};

export default GelSlice