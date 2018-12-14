import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

const defaultFontSize = "8px"

class LegendField extends Component {

    render() {
        const { x, y, width, text, height, legend, idx, onMouseOver, mouseOverId, sampleIdx} = this.props;
        const yMiddle = y+13



        return <g onMouseOver={() => { if(onMouseOver) onMouseOver(idx) } }>
            <rect
                className="merged-legend-field"
                x={x}
                y={y}
                width={width}
                height={height}
                fill={"white"}
            />
            <text x={x+width*0.25} y={yMiddle} fontFamily="sans-serif" fontSize={defaultFontSize}>{text}</text>
            { legend(x+10, y+height-2, height+4, idx, mouseOverId, sampleIdx) }
        </g>

    }
}

LegendField.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    legend: PropTypes.func.isRequired,
    idx: PropTypes.number,
    onMouseOver: PropTypes.func,
    mouseOverId: PropTypes.number,
    sampleIdx: PropTypes.number
};

export default (LegendField);