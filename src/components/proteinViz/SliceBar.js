import React, {
    PureComponent,
} from 'react'
import PropTypes from 'prop-types'
import {mouse, select} from "d3-selection";


class SliceBar extends PureComponent {

    onMouseOver = () => {
        const {getMousePos, mouseIsOver, isHighlighted, sliceIdx, popOverCB} = this.props
        const [x, y] = getMousePos()
        const showRemoveMessage = mouseIsOver & isHighlighted
        popOverCB(sliceIdx, x, y, showRemoveMessage)
    }

    onMouseOut = () => {
        this.props.removePopOverCB()
    }

    onClick = () => {
        const {clickCB, sliceIdx} = this.props
        clickCB(sliceIdx)
    }

    plotBackgroundRect = (xPos, yPos, width, height) => {
        return <rect
            className={"slice-bar-background"}
            x={xPos}
            y={yPos}
            width={width}
            height={height}
            stroke={"white"}
            fill={"white"}
            onMouseOver={() => this.onMouseOver()}
            onMouseOut={() => this.onMouseOut()}
            onClick={() => this.onClick()}
        />
    }

    render() {
        const {mass, int, color, margin, xScale, yScale, isHighlighted, mouseIsOver} = this.props

        const width = mouseIsOver ? 3 : 1
        const height = yScale(0) - yScale(int)
        const xPos = xScale(mass) + margin.left - width/2
        const yPos = yScale(int) + margin.top

        return <g>
            {this.plotBackgroundRect(xPos, yPos, width, height)}
            <rect
                className={"slice-bar" + (isHighlighted ? " highlighted" : "")}
                x={xPos }
                y={yPos}
                width={width}
                height={height}
                stroke={isHighlighted ? "deeppink" : "None"}
                fill={isHighlighted ? "deeppink" : color}
            />
        </g>
    }

}

SliceBar.propTypes = {
    mass: PropTypes.number.isRequired,
    int: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    margin: PropTypes.object.isRequired,
    highlight: PropTypes.bool.isRequired,
    svgParent: PropTypes.object.isRequired,
    popOverCB: PropTypes.func.isRequired,
    removePopOverCB: PropTypes.func.isRequired,
    clickCB: PropTypes.func.isRequired,
    sliceIdx: PropTypes.number.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    mouseIsOver: PropTypes.bool,
    getMousePos: PropTypes.func.isRequired,
};

export default SliceBar