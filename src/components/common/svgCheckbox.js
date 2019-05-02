import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types'

const defaultColor = "grey"
const mouseOverColor = "black"

class SvgCheckbox extends Component {

    constructor(props) {
        super(props)

        this.state = {
            color: defaultColor
        }
    }

    onEnter = () => {
        this.setState({
            color: mouseOverColor
        })
    }

    onLeave = () => {
        this.setState({
            color: defaultColor
        })
    }

    onClick = (e) => {
        e.stopPropagation()
        this.props.changeSelection()
    }

    render() {
        const {x, y, isActive} = this.props

        const thisWidth = 7
        const thisHeight = 7
        const thisX = (x  - thisWidth - 6)
        const thisY = (y + 12 - thisHeight)

        // svg path for check
        const checkPath = "M" + (thisX+2) + " " + (thisY+thisHeight/2) + " L" + (thisX+thisWidth/2-0.5) + " " + (thisY+5)  + " L" + (thisX+thisHeight-2) + " " + (thisY+2)

        return <g
            className="pumba-svg-checkbox"
            onClick={(e) => this.onClick(e)}
            onMouseEnter={() => this.onEnter()}
            onMouseLeave={() => this.onLeave()}
        >
            <rect
                x={thisX}
                y={thisY}
                rx={1}
                ry={1}
                width={thisWidth}
                height={thisHeight}
                stroke={this.state.color}
                strokeWidth={0.5}
                fill={"transparent"}
            />

            { isActive && <path stroke={this.state.color} fill="transparent" d={checkPath}></path> }
        </g>
    }
}

SvgCheckbox.propTypes = {
    changeSelection: PropTypes.func.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired
}

export default (SvgCheckbox);