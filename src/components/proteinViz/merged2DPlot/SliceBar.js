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
            console.log("click click click")
        })
    }

    render() {
        const {mass, int, color, highlight, margin, xScale, yScale} = this.props

        const xPos = xScale(mass) + margin.left

        return <line
            className={"slice-bar"}
            x1={xPos}
            y1={yScale(0) + margin.top}
            x2={xPos}
            y2={yScale(int) + margin.top}
            stroke={color}
            strokeWidth={ highlight ? 2 : 0.5 }
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
    sliceIdx: PropTypes.number.isRequired
};

export default SliceBar