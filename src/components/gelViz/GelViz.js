import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'


class GelViz extends Component {

    render() {
        const {viewWidth, viewHeight} = this.props

        console.log("got rendered")

        return <div id={"gel-plot"}>
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

GelViz.propTypes = {
    proteinData: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
};

export default GelViz