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

        setTimeout(()=>{
            console.log("componentDidMount Peptide")
            console.log(this.rectDom)
            console.log(select(this.rectDom))

        }, 1000)
    }

    render() {
        const {yScale, xScale, pepInfo, sliceMolWeight, sampleIdx, replIdx, yZoomFactor} = this.props;

        const y = yScale(sliceMolWeight[replIdx][pepInfo.sliceNr])
        const xStart = xScale(pepInfo.startPos)
        const xEnd = xScale(pepInfo.endPos);
        const xDiff = xEnd - xStart;

        // special settings if mouse is over this peptide
        const height = yZoomFactor * ((this.state.mouseIsOver) ? this.selRectHeight : this.defaultRectHeight)
        const stroke = this.state.mouseIsOver ? "black" : "None"

        return (
            <rect
                className="psm"
                id={pepInfo.id}
                x={ (xStart < 0) ? 0 : xStart }
                y={y - height/2}
                width={xDiff}
                height={height}
                fill={sampleColor(sampleIdx)}
                fillOpacity={0.5}
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
    yZoomFactor: PropTypes.number.isRequired
};


export default Peptide;