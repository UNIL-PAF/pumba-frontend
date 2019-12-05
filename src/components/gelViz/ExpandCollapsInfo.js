import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'

class ExpandCollapsInfo extends PureComponent {

    yTranslate = 343
    xTranslate = 10

    plotLeftArrow = () => {
        const {xPos} = this.props

        return <g transform={"translate(" + (xPos + this.xTranslate) + "," + this.yTranslate + ") scale(0.05,0.05)"}>
            <path d="M145.768,290.197c-6.137,0-12.25-5.831-13.412-7.002c-4.194-3.092-115.082-86.691-127.269-98.856      c-4.422-4.444-5.203-8.894-5.074-11.856c0.288-7.089,5.768-11.935,6.389-12.463L129.738,57.946      c1.351-1.474,7.617-7.611,13.577-7.611c2.717,0,9.031,1.243,9.031,12.691v52.623H326.47c0.486-0.081,1.135-0.156,1.903-0.156      c2.03,0,12.16,0.774,12.16,15.976v80.87c0,11.187-7.927,14.153-12.118,14.153H156.012v48.23      C156.012,288.191,149.593,290.197,145.768,290.197z M145.768,280.451v4.87V280.451L145.768,280.451z"/>
        </g>
    }

    plotRightArrow = () => {
        const {xPos} = this.props

        return <g transform={"rotate(180, " + (xPos + this.xTranslate + 9) + ", " + (this.yTranslate + 8) + ")"}>
            {this.plotLeftArrow()}
        </g>
    }

    render() {
        const {xPos, yPos, showExpand} = this.props

        return <g style={{pointerEvents: 'none'}}>
            <text className={"expand-info"} x={xPos} y={yPos + 2}>{showExpand ? 'Expand samples' : 'Collapse samples'}</text>
            {showExpand ? this.plotRightArrow() : this.plotLeftArrow()}
        </g>
    }

}

ExpandCollapsInfo.propTypes = {
    xPos: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    showExpand: PropTypes.bool.isRequired
};

export default ExpandCollapsInfo