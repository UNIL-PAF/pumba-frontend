import React, {
    PureComponent,
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import SliceBar from "./SliceBar"


class SliceBars extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {}
    }

    plotOneProtein = (protein, color, keyName, highlight) => {
        const {zoomLeft, zoomRight} = this.props

        // in case it got deactivated and the mouse is still over it we return null
        if(! protein) return null

        const massFits = protein.dataSet.massFitResult.massFits
        const ints = protein.intensities

        // filter out entries which are not in the visual range, in case a zoom was set
        const slices = _.map(_.zip(massFits, ints), (x, i) => {return x.concat(i)})

        const fltSlices = (zoomLeft) ? (_.filter(slices, (s) => {
            return s[0] >= zoomLeft && s[0] <= zoomRight && s[1]
        })) : slices;

        return _.map(fltSlices, (x) => {
            return this.plotOneSlice(x[0], x[1], color, keyName+x[2], highlight, protein, x[2])
        })
    }

    showPopOverCB = (protein, sliceIdx, x, y) => {
        const peptides = _.filter(protein.peptides, (pep) => {
            return pep.sliceNr === (sliceIdx + 1)
        })

        var popUpContent = {
            Sample: protein.dataSet.sample,
            Replicate: protein.dataSet.name,
            '# Peptides': peptides.length,
            'Mol weight': Math.pow(10, protein.dataSet.massFitResult.massFits[sliceIdx]).toFixed(2) + " kDa",
            'Gel slice': sliceIdx + 1
        }

        const popUp = {x: x, y: y, content: popUpContent, tag: protein.dataSet.sample + ':' + protein.dataSet.name + ':' + sliceIdx}
        this.props.showPopupCB(popUp)
    }

    clickCB = (protein, sliceIdx) => {
        const {clickSliceCB, history, removePopupCB, clickedSlices, unclickSliceCB} = this.props

        // first remove the old selection, currently we should only have one
        unclickSliceCB(clickedSlices[0])

        const peptides = _.filter(protein.peptides, (pep) => {
            return pep.sliceNr === (sliceIdx + 1)
        })

        const sample = protein.dataSet.sample
        const replicate = protein.dataSet.name

        const slice = {
            tag: sample + ':' + replicate + ':' + sliceIdx,
            sample: sample,
            replicate: replicate,
            idx: sliceIdx,
            peptides: peptides
        }
        clickSliceCB(slice)
        removePopupCB()
        history.push('/peptides')
    }

    removePopOverCB = () => {
        this.props.removePopupCB()
    }

    plotOneSlice = (mass, int, color, keyName, highlight, protein, sliceIdx) => {
        const {margin, xScale, yScale, svgParent, clickedSlices, mouseOverTag} = this.props

        const showSlicePopOverCB = (sliceIdx, x, y) => {return this.showPopOverCB(protein, sliceIdx, x, y)}
        const clickSliceCB = (sliceIdx) => {return this.clickCB(protein, sliceIdx)}

        const sliceTag = protein.dataSet.sample + ':' + protein.dataSet.name + ':' + sliceIdx
        const isHighlighted = _.some(clickedSlices, (x) => {
            return x.tag === sliceTag
        })

        return <SliceBar
            key={keyName} mass={mass} int={int} color={color} xScale={xScale} yScale={yScale} margin={margin}
            highlight={highlight} svgParent={svgParent} popOverCB={showSlicePopOverCB} removePopOverCB={this.removePopOverCB}
            sliceIdx={sliceIdx} clickCB={clickSliceCB} isHighlighted={isHighlighted} mouseIsOver={mouseOverTag === sliceTag}/>
    }

    render() {
        const {sampleName, replId, proteins, color} = this.props
        const currentProtein = _.find(proteins.proteins, (p) => {return p.dataSet.id === replId})

        return  <g>
            { this.plotOneProtein(currentProtein, color, "slice-bar-"+sampleName+"-", true) }
        </g>
    }

}

SliceBars.propTypes = {
    proteins: PropTypes.object.isRequired,
    sampleName: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    replId: PropTypes.string.isRequired,
    margin: PropTypes.object.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    svgParent: PropTypes.object.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    unclickSliceCB: PropTypes.func.isRequired,
    clickSliceCB: PropTypes.func.isRequired,
    mouseOverTag: PropTypes.string,
    clickedSlices: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    scaleChanged: PropTypes.number.isRequired
};

export default SliceBars