import React, {
    PureComponent,
} from 'react'
import PropTypes from 'prop-types'
import {sampleColor} from "../common/colorSettings";
import * as _ from 'lodash'

import ProteinSliceBars from "./ProteinSliceBars";


class ProteinMerges extends PureComponent {

    plotOneProteinMerge = (proteinMerge, proteinInfo) => {
        const {datasets, mouseOverSampleId} = this.props

        const sampleIdx = datasets[proteinInfo.sample].idx
        const sampleName = datasets[proteinInfo.sample].name
        const sampleCol = sampleColor(sampleIdx)
        const highlight = (mouseOverSampleId === sampleName)

        return <polyline className="merged-plot-line" key={sampleIdx} points={this.theoPosString(proteinMerge.theoMergedProtein)}
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

    plotSliceBars = (sampleName, replId) => {
        const {zoomLeft, zoomRight, showPopupCB, removePopupCB, clickSliceCB, unclickSliceCB, clickedSlices, popup,
            history, margin, xScale, yScale, svgParent, scaleChanged, datasets, proteinData} = this.props

        const proteins = _.find(proteinData, (p) => { return p.sample === sampleName})
        const color = sampleColor(datasets[proteins.sample].idx)

        return <ProteinSliceBars key={sampleName + ':' + replId} sampleName={sampleName} replId={replId} margin={margin} xScale={xScale}
                                 yScale={yScale} zoomLeft={zoomLeft} zoomRight={zoomRight} proteins={proteins}
                                 svgParent={svgParent} showPopupCB={showPopupCB} removePopupCB={removePopupCB}
                                 clickSliceCB={clickSliceCB} unclickSliceCB={unclickSliceCB} clickedSlices={clickedSlices} mouseOverTag={popup ? popup.tag : undefined}
                                 history={history} scaleChanged={scaleChanged} color={color}
        />
    }

    render() {
        const {proteinData, mouseOverSampleId, mouseOverReplId, theoMergedProteins, clickedRepl} = this.props

        // theoMergedProteins contain the filtered values, based on the given zoom range
        // they were filtered in the merged2DPlotActions
        const mergedData = (theoMergedProteins) ? theoMergedProteins : proteinData

        return <g>
            { _.map(mergedData, (p, i) => this.plotOneProteinMerge(p, proteinData[i])) }
            { typeof mouseOverReplId !== "undefined" && this.plotSliceBars(mouseOverSampleId, mouseOverReplId)}
            { (clickedRepl.length === 0) || _.map(clickedRepl, (v) => {return this.plotSliceBars(v.sampleIdx, v.replIdx)}) }
        </g>
    }

}

ProteinMerges.propTypes = {
    proteinData: PropTypes.array.isRequired,
    theoMergedProteins: PropTypes.array,
    unclickSliceCB: PropTypes.func.isRequired,
    clickSliceCB: PropTypes.func.isRequired,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
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
    scaleChanged: PropTypes.number.isRequired,
    datasets: PropTypes.object.isRequired
};

export default ProteinMerges