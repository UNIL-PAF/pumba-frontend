import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import { select, event, mouse } from 'd3-selection'
import { sampleColor } from '../common/colorSettings'

class Peptide extends Component {

    defaultRectHeight = 1;
    selRectHeight = 1;

    constructor(props){
        super(props)

        this.state = this.setDefaultRect();
    }

    mouseOutPep = () => {
        this.setState({
            rectBorder: 'none',
        });
        const stateObj = this.setDefaultRect(this.props)
        this.setState(stateObj);
    }

    setDefaultRect = () => {
        return {
            rectBorder: 'none',
            mouseIsOver: false
        };
    }

    componentDidMount(){
        const {svgParent} = this.props;

        // this event we have to call using D3 in order to get the mouse position correctly
        select(this.rectDom).on('mouseenter', () => {
            const [x,y] = mouse(svgParent)
            this.setState({mouseIsOver: true})
            console.log("mouse over", x, y)
        })

        select(this.rectDom).on('mouseout', () => {
            this.mouseOutPep()
        })

        select(this.rectDom).on('click', () => {
            const [x,y] = mouse(svgParent)
            this.props.clickOnPep(this.rectDom.id, x, y)
        })
    }

    render() {
        const {yScale, xScale, pepInfo, sliceMolWeight, sampleIdx, replIdx, yZoomFactor, highlightRepl, sliceIsClicked} = this.props;

        const y = yScale(sliceMolWeight[replIdx][pepInfo.sliceNr])
        const xStart = xScale(pepInfo.startPos)
        const xEnd = xScale(pepInfo.endPos);
        const xDiff = xEnd - xStart;

        // special settings if mouse is over this peptide
        const height = ((this.state.mouseIsOver) ? this.selRectHeight : this.defaultRectHeight) // * yZoomFactor
        const height_2 = (highlightRepl) ? height * 2 : height

        var stroke = this.state.mouseIsOver ? sampleColor(sampleIdx) : "None"
        stroke = (sliceIsClicked) ? "deeppink" : stroke

        var fill = sampleColor(sampleIdx)
        fill = (this.state.mouseIsOver && sliceIsClicked) ? "deeppink" : fill

        var fillOpacity = highlightRepl ? 0.7 : 0.5
        fillOpacity = this.state.mouseIsOver ? 1 : fillOpacity

        return (
            <rect
                className="psm"
                id={pepInfo.id}
                x={ (xStart < 0) ? 0 : xStart }
                y={y - height_2/2}
                width={xDiff}
                height={height_2}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={stroke}
                ref={r => this.rectDom = r}
            />
        )

    }
}

Peptide.propTypes = {
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    sampleIdx: PropTypes.number.isRequired,
    replIdx: PropTypes.number.isRequired,
    actions: PropTypes.object,
    pepInfo: PropTypes.object.isRequired,
    sliceMolWeight: PropTypes.array,
    svgParent: PropTypes.object.isRequired,
    yZoomFactor: PropTypes.number.isRequired,
    highlightRepl: PropTypes.bool.isRequired,
    sliceIsClicked: PropTypes.bool.isRequired
};


export default Peptide;