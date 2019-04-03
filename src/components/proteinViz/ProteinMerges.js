import React, {
    PureComponent,
} from 'react'
import PropTypes from 'prop-types'
import {sampleColor} from "../common/colorSettings";
import * as _ from 'lodash'
import shallowCompare from 'react-addons-shallow-compare'

import ProteinSliceBars from "./ProteinSliceBars";


class ProteinMerges extends PureComponent {

    plotOneProteinMerge = (proteinMerge, idx) => {
        const sampleCol = sampleColor(idx)
        const highlight = (this.props.mouseOverSampleId === idx)

        return <polyline className="merged-plot-line" key={idx} points={this.theoPosString(proteinMerge)}
                         stroke={sampleCol} fill="transparent" strokeWidth={ highlight ? "2" : "1" }/>
    }

    /**
     * Give back a string with the positions of the merged protein points
     * @param theoMergedProtein
     * @returns {string}
     */
    theoPosString = (theoMergedProtein) => {
        const {xScale, yScale, margin} = this.props

        const weightIntPairs = _.zip(theoMergedProtein.theoMolWeights, theoMergedProtein.intensities)

        const res = _.map(weightIntPairs, (p) => {
            return (xScale(p[0]) + margin.left) + "," + (yScale(p[1]) + margin.top)
        }).join(" ")

        return res
    }

    plotSliceBars = (proteins, sampleIdx, replIdx) => {
        const {zoomLeft, zoomRight, showPopupCB, removePopupCB, clickSliceCB, unclickSliceCB, clickedSlices, popup,
            history, margin, xScale, yScale, svgParent} = this.props

        return <ProteinSliceBars key={sampleIdx + ':' + replIdx} sampleIdx={sampleIdx} replIdx={replIdx} margin={margin} xScale={xScale}
                                 yScale={yScale} zoomLeft={zoomLeft} zoomRight={zoomRight} proteins={proteins}
                                 svgParent={svgParent} showPopupCB={showPopupCB} removePopupCB={removePopupCB}
                                 clickSliceCB={clickSliceCB} unclickSliceCB={unclickSliceCB} clickedSlices={clickedSlices} mouseOverTag={popup ? popup.tag : undefined}
                                 history={history}
        />
    }

    render() {
        console.log("render")
        const {proteinData, mouseOverSampleId, mouseOverReplId, theoMergedProteins, clickedRepl} = this.props

        // theoMergedProteins contain the filtered values, based on the given zoom range
        // they were filtered in the merged2DPlotActions
        const mergedData = (theoMergedProteins) ? theoMergedProteins : proteinData

        return <g>
            { _.map(mergedData, (p, i) => this.plotOneProteinMerge(p.theoMergedProtein, i, mouseOverSampleId)) }
            { typeof mouseOverReplId !== "undefined" && this.plotSliceBars(proteinData[mouseOverSampleId], mouseOverSampleId, mouseOverReplId)}
            { (clickedRepl.length === 0) || _.map(clickedRepl, (v) => {return this.plotSliceBars(proteinData[v.sampleIdx], v.sampleIdx, v.replIdx)}) }
        </g>
    }

}

ProteinMerges.propTypes = {
    proteinData: PropTypes.array.isRequired,
    theoMergedProteins: PropTypes.array,
    unclickSliceCB: PropTypes.func.isRequired,
    clickSliceCB: PropTypes.func.isRequired,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    clickedRepl: PropTypes.array.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    popup: PropTypes.object,
    clickedSlices: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    margin: PropTypes.object.isRequired,
    svgParent: PropTypes.object.isRequired,
    scaleChanged: PropTypes.number.isRequired
};

export default ProteinMerges