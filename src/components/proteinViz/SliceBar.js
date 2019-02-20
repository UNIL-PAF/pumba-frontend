import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import {mouse, select} from "d3-selection";


class SliceBar extends Component {

    componentDidMount(){

        const {svgParent, popOverCB, sliceIdx, removePopOverCB, clickCB, mouseIsOver, isHighlighted} = this.props;

        // this event we have to call using D3 in order to get the mouse position correctly
        select(this.rectDom).on('mouseover', () => {
            const [x,y] = mouse(svgParent)
            // showSlicePopOverCB
            const showRemoveMessage = mouseIsOver & isHighlighted
            popOverCB(sliceIdx, x, y, showRemoveMessage)
        })

        select(this.rectDom).on('mouseout', () => {
            removePopOverCB()
        })

        select(this.rectDom).on('click', () => {
            clickCB(sliceIdx)
        })
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
            ref={r => this.rectDom = r}
        />
    }

    render() {
        const {mass, int, color, margin, xScale, yScale, isHighlighted, mouseIsOver} = this.props

        const width = mouseIsOver ? 4 : 2
        const height = yScale(0) - yScale(int)
        const xPos = xScale(mass) + margin.left - width/2
        const yPos = yScale(int) + margin.top

        return <g>
            {this.plotBackgroundRect(xPos, yPos, width, height)}
            <rect
                className={"slice-bar"}
                x={xPos }
                y={yPos}
                width={width}
                height={height}
                stroke={isHighlighted ? "deeppink" : "None"}
                fill={color}
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
    mouseIsOver: PropTypes.bool
};

export default SliceBar