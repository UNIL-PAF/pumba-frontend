import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types'

const defaultColor = "lightgrey"
const mouseOverColor = "black"

class MoveButton extends Component {

    constructor(props) {
        super(props)

        this.state = {
            color: defaultColor,
            cursor: {}
        }
    }

    onEnter = () => {
        this.setState({
            color: mouseOverColor,
            cursor: {cursor: "grab"}
        })
    }

    onLeave = () => {
        this.setState({
            color: defaultColor,
            cursor: {}
        })
    }

    render() {
        const {x, y, legendIsMoving, onMouseDown, onMouseUp} = this.props
        const {color, cursor} = this.state

        const localCursor = legendIsMoving ? {cursor: "grabbing"} : cursor

        const thisWidth = 20
        const thisHeight = 20
        const thisX = (x-4)
        const thisY = (y-5)

         return <svg version="1.1" x={thisX} y={thisY} viewBox="0 0 96 96" enableBackground="new 0 0 96 96" width={thisWidth} height={thisHeight}>
                    <g onMouseOver={() => this.onEnter()} onMouseLeave={() => this.onLeave()} onMouseDown={() => onMouseDown()} onMouseUp={() => onMouseUp()} style={localCursor}>
                        <rect
                                 x={12}
                                 y={12}
                                 width={72}
                                 height={72}
                                 fill={"transparent"}
                        />

                        <path d="M73,48.4l-10.4-9.6v4.8H52.4V33.4h4.8L47.6,23l-8.9,10.4h4.8v10.2H33.4v-4.8L23,48.4l10.4,8.9v-4.8h10.2v10.2h-4.8L47.6,73   l9.6-10.4h-4.8V52.4h10.2v4.8L73,48.4z"
                            fill={color}
                        />
                    </g>
                </svg>
    }
}

MoveButton.propTypes = {
    onMouseDown: PropTypes.func.isRequired,
    onMouseUp: PropTypes.func.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    legendIsMoving: PropTypes.bool.isRequired,
}

export default (MoveButton);