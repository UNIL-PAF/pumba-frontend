import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../common/CloseButton'
import SvgCheckbox from '../common/svgCheckbox'

const defaultFontSize = "8px"

class LegendField extends Component {

    clickOnLegend = () => {
        const {clickeablePointer, sampleName, mouseClickReplCB, replId} = this.props

        if(clickeablePointer){
            mouseClickReplCB(sampleName, replId)
        }
    }

    closeLegend = (sampleIdx, replIdx) => {
        this.props.removeSelectedReplCB(sampleIdx, replIdx)
    }


    render() {
        const { x, y, width, text, height, legend, onMouseOver, mouseOverId,
            clickeablePointer, isSelected, colorIdx, isUnactiveable, changeSelection,
            showCheckbox, sampleName, replId, mouseOverLegend, isActive, textColor} = this.props;

        const legendSettings = {
            mouseOverLegend: mouseOverLegend,
            replId: replId,
            mouseOverId: mouseOverId,
            sampleName: sampleName,
            colorIdx: colorIdx,
            isSelected: isSelected,
            isActive: isActive
        }

        const yMiddle = y+13

        return <g style={ (clickeablePointer) ? {cursor: 'pointer'} : {} }
                  onMouseOver={() => { if(onMouseOver) onMouseOver(sampleName, replId) } }
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
            {isUnactiveable && showCheckbox && <SvgCheckbox x={x + 6} y={y + 2} changeSelection={changeSelection} isActive={isActive}></SvgCheckbox>}
            <text x={x+width*0.25} y={yMiddle} fontFamily="sans-serif" fontSize={defaultFontSize} fill={textColor || "black"}>{text}</text>
            { legend(x+10, y+height-2, height+4, legendSettings) }
            { (isSelected) && <CloseButton x={x + width} y={y + 2} onCloseCB={() => this.closeLegend(sampleName, replId)}></CloseButton> }
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
    onMouseOver: PropTypes.func,
    mouseClickReplCB: PropTypes.func,
    removeSelectedReplCB: PropTypes.func,
    replId: PropTypes.string,
    sampleName: PropTypes.string,
    clickeablePointer: PropTypes.bool,
    isSelected: PropTypes.bool,
    isUnactiveable: PropTypes.bool.isRequired,
    changeSelection: PropTypes.func,
    showCheckbox: PropTypes.bool,
    mouseOverLegend: PropTypes.bool,
    isActive: PropTypes.bool,
    textColor: PropTypes.string
};

export default (LegendField);