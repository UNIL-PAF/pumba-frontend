import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../common/CloseButton'
import SvgCheckbox from '../common/svgCheckbox'

const defaultFontSize = "8px"

class LegendField extends Component {

    clickOnLegend = () => {
        const {clickeablePointer, idx, sampleIdx, mouseClickReplCB} = this.props

        if(clickeablePointer){
            mouseClickReplCB(sampleIdx, idx)
        }
    }

    closeLegend = (sampleIdx, replIdx) => {
        this.props.removeSelectedReplCB(sampleIdx, replIdx)
    }


    render() {
        const { x, y, width, text, height, legend, idx, onMouseOver, mouseOverId,
            sampleIdx, clickeablePointer, isSelected, colorIdx, isUnactiveable, changeSelection, showCheckbox} = this.props;

        const yMiddle = y+13

        return <g style={ (clickeablePointer) ? {cursor: 'pointer'} : {} }
                  onMouseOver={() => { if(onMouseOver) onMouseOver(sampleIdx, idx) } }
                  onClick={() => this.clickOnLegend()}>
            <rect
                className="merged-legend-field"
                x={x+3}
                y={y}
                width={width-3}
                height={height-1}
                fill={"white"}
                stroke={(isSelected) ? "silver" : undefined}
                rx={5}
                ry={5}
            />
            {isUnactiveable && showCheckbox && <SvgCheckbox x={x + 6} y={y + 2} changeSelection={changeSelection}></SvgCheckbox>}
            <text x={x+width*0.25} y={yMiddle} fontFamily="sans-serif" fontSize={defaultFontSize}>{text}</text>
            { legend(x+10, y+height-2, height+4, idx, mouseOverId, sampleIdx, colorIdx, isSelected) }
            { (isSelected) && <CloseButton x={x + width} y={y + 2} onCloseCB={() => this.closeLegend(parseInt(sampleIdx, 10), idx)}></CloseButton> }
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
    mouseClickReplCB: PropTypes.func,
    removeSelectedReplCB: PropTypes.func,
    mouseOverId: PropTypes.number,
    sampleIdx: PropTypes.number,
    colorIdx: PropTypes.number,
    clickeablePointer: PropTypes.bool,
    isSelected: PropTypes.bool,
    isUnactiveable: PropTypes.bool.isRequired,
    changeSelection: PropTypes.func,
    showCheckbox: PropTypes.bool,
};

export default (LegendField);