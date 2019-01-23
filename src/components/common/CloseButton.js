import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types'

const defaultRemoveCrossColor = "grey"
const defaultRemoveRectColor = "white"

class CloseButton extends Component {

    constructor(props) {
        super(props)

        this.state = {
            removeCrossColor: defaultRemoveCrossColor,
            removeRectColor: defaultRemoveRectColor
        }
    }

    onRemoveEnter = () => {
        this.setState({
            removeCrossColor: "white",
            removeRectColor: "red"
        })
    }

    onRemoveLeave = () => {
        this.setState({
            removeCrossColor: defaultRemoveCrossColor,
            removeRectColor: defaultRemoveRectColor
        })
    }

    onClick = (e) => {
        e.stopPropagation()
        this.props.onCloseCB()
    }

    render() {

        const {x, y} = this.props

        const thisWidth = 5
        const thisHeight = 5
        const thisX = (x  - thisWidth - 6)
        const thisY = (y + 10 - thisHeight)

        return <g
            className="pumba-close-button"
            onClick={(e) => this.onClick(e)}
            onMouseEnter={() => this.onRemoveEnter()}
            onMouseLeave={() => this.onRemoveLeave()}
        >
            <circle
                cx={thisX + thisWidth / 2}
                cy={thisY + thisHeight / 2}
                r={thisWidth + 0.5}
                fill={this.state.removeRectColor}
                fillOpacity={0.9}
            />

            <line
                x1={thisX}
                y1={thisY}
                x2={thisX + thisWidth}
                y2={thisY + thisHeight}
                stroke={this.state.removeCrossColor}
                strokeLinecap="round"
            />

            <line
                x1={thisX + thisWidth}
                y1={thisY}
                x2={thisX}
                y2={thisY + thisHeight}
                stroke={this.state.removeCrossColor}
                strokeLinecap="round"
            />

        </g>
    }
}

CloseButton.propTypes = {
    onCloseCB: PropTypes.func.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
}

export default (CloseButton);