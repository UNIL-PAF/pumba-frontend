import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import {mouse, select} from "d3-selection";


class SliceBar extends Component {

    componentDidMount(){

        const {svgParent, popOverCB, sliceIdx, removePopOverCB, clickCB} = this.props;

        // this event we have to call using D3 in order to get the mouse position correctly
        select(this.lineDom).on('mouseover', () => {
            const [x,y] = mouse(svgParent)
            // showSlicePopOverCB
            popOverCB(sliceIdx, x, y)
        })

        select(this.lineDom).on('mouseout', () => {
            removePopOverCB()
        })

        select(this.lineDom).on('click', () => {
            clickCB(sliceIdx)
        })
    }

    render() {
        const {mass, int, color, margin, xScale, yScale, isHighlighted, mouseIsOver} = this.props

        const xPos = xScale(mass) + margin.left
        const width = mouseIsOver ? 4 : 2
        const height = yScale(0) - yScale(int)

        return <rect
            className={"slice-bar"}
            x={xPos - width/2}
            y={yScale(int) + margin.top}
            width={width}
            height={height}
            stroke={isHighlighted ? "deeppink" : "None"}
            fill={color}
            ref={r => this.lineDom = r}
        />
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