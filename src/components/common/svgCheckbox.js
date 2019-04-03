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
        console.log("enter")
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
        this.props.onCloseCB()
    }

    render() {
        const {x, y} = this.props

        const thisWidth = 7
        const thisHeight = 7
        const thisX = (x  - thisWidth - 6)
        const thisY = (y + 12 - thisHeight)

        // svg path for check
        const checkPath = "M" + (thisX+1) + " " + (thisY+thisHeight/2) + " L" + (thisX+thisWidth/2) + " " + (thisY+6)  + " L" + (thisX+thisHeight-1) + " " + (thisY+1)

        return <g
            className="pumba-svg-checkbox"
            onClick={(e) => this.onClick(e)}
            onMouseEnter={() => this.onEnter()}
            onMouseLeave={() => this.onLeave()}
        >
            <rect
                x={thisX}
                y={thisY}
                cx={2}
                cy={2}
                width={thisWidth}
                height={thisHeight}
                stroke={this.state.color}
                strokeWidth={0.5}
                fill={"transparent"}
            />

            <path stroke={this.state.color} fill="transparent" d={checkPath}></path>
        </g>
    }
}

SvgCheckbox.propTypes = {
    onChange: PropTypes.func,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
}

export default (SvgCheckbox);