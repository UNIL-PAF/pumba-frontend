import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import { select, mouse } from 'd3-selection'

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
        const {svgParent, pepInfo, showPopupCB, sampleName, replName, sliceMolWeight} = this.props;

        // this event we have to call using D3 in order to get the mouse position correctly
        select(this.rectDom).on('mouseenter', () => {
            this.setState({'mouseIsOver': true})
            const [x,y] = mouse(svgParent)

            var popUpContent = {
                Sample: sampleName,
                Replicate: replName,
                Sequence: pepInfo.aminoAcidBefore + "." + pepInfo.sequence + "." + pepInfo.aminoAcidAfter,
                "Start pos" : pepInfo.startPos,
                "End pos" : pepInfo.endPos,
                //"Pep mol weight": Math.pow(10, pepInfo.theoMass).toFixed(2),
                "Razor pep": pepInfo.isRazor ? "True": "False",
                "Mol weight": Math.pow(10, sliceMolWeight).toFixed(2) + " kDa",
                "Gel slice": pepInfo.sliceNr,
            }
            const popUp = {x: x, y: y, content: popUpContent}
            showPopupCB(popUp)
        })

        select(this.rectDom).on('mouseout', () => {
            this.setState({'mouseIsOver': false})
            this.props.removePopupCB()
        })

        // select(this.rectDom).on('click', () => {
        //     const [x,y] = mouse(svgParent)
        //     this.props.clickOnPep(this.rectDom.id, x, y)
        // })
    }

    render() {
        const {yScale, xScale, pepInfo, sliceMolWeight, highlightRepl, sliceIsClicked, color} = this.props;
        const {mouseIsOver} = this.state

        const y = yScale(sliceMolWeight)
        const xStart = xScale(pepInfo.startPos)
        const xEnd = xScale(pepInfo.endPos);
        const xDiff = xEnd - xStart;

        // special settings if mouse is over this peptide
        const height = ((mouseIsOver) ? this.selRectHeight : this.defaultRectHeight)
        const height_2 = (highlightRepl) ? height * 2 : height

        var stroke = mouseIsOver ? color : "None"

        var fill = color

        var fillOpacity = highlightRepl ? 0.7 : 0.5
        fillOpacity = this.state.mouseIsOver ? 1 : fillOpacity

        return (
            <rect
                className={"psm" + (sliceIsClicked ? " highlighted" : "") + (mouseIsOver && sliceIsClicked ? " active" : "")}
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
    sampleName: PropTypes.string.isRequired,
    replName: PropTypes.string.isRequired,
    actions: PropTypes.object,
    pepInfo: PropTypes.object.isRequired,
    sliceMolWeight: PropTypes.number,
    svgParent: PropTypes.object.isRequired,
    highlightRepl: PropTypes.bool.isRequired,
    sliceIsClicked: PropTypes.bool.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired
};


export default Peptide;