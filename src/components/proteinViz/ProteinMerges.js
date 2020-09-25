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

        // in case the sample was deactivated
        if(! proteinInfo) return null

        const sampleIdx = datasets[proteinInfo.sample].colorGroup
        const sampleName = datasets[proteinInfo.sample].name
        const sampleCol = sampleColor(sampleIdx)
        const highlight = (mouseOverSampleId === sampleName)

        // only show active datasets
        if(! datasets[proteinInfo.sample].isActive) return null

        return <polyline className="merged-plot-line" key={sampleIdx} points={this.theoPosString(proteinMerge.theoMergedProtein)}
                         stroke={sampleCol} fill="transparent" fillOpacity={0.0} strokeWidth={ highlight ? "2" : "1" }/>
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

    plotSliceBars = () => {
        const {zoomLeft, zoomRight, showPopupCB, removePopupCB, clickSliceCB, unclickSliceCB, clickedSlices, popup,
            history, margin, xScale, yScale, svgParent, scaleChanged, datasets, proteinData, getMousePos,
            mouseOverSampleId, mouseOverReplId} = this.props

        return _.flatMap(datasets, (v, sample) => {
            const proteins = _.find(proteinData, (p) => { return p.sample === sample && v.isActive})
            const color = sampleColor(v.colorGroup)

            return _.map(v.datasets, (d) => {
                // check if the mouse is over this dataset
                const mouseOverDataset = (mouseOverSampleId === sample && mouseOverReplId === d.id)

                // only plot the bars if the dataset is selected
                // if we unactivate a sample with a selected replicate it will have no protein
                if(!mouseOverDataset && ( !(d.isSelected && d.isSelected.prot)  || !proteins)) return null

                const oneProtein = _.find(proteins.proteins, (p) => { return p.dataSet.id === d.id})

                return <ProteinSliceBars key={v.idx + ':' + d.idx} sampleName={sample} margin={margin} xScale={xScale}
                                         yScale={yScale} zoomLeft={zoomLeft} zoomRight={zoomRight} proteins={oneProtein}
                                         svgParent={svgParent} showPopupCB={showPopupCB} removePopupCB={removePopupCB}
                                         clickSliceCB={clickSliceCB} unclickSliceCB={unclickSliceCB} clickedSlices={clickedSlices} mouseOverTag={popup ? popup.tag : undefined}
                                         history={history} scaleChanged={scaleChanged} color={color} getMousePos={getMousePos}
                />

            })
        })
    }

    render() {
        const {proteinData, theoMergedProteins} = this.props

        // theoMergedProteins contain the filtered values, based on the given zoom range
        // they were filtered in the merged2DPlotActions
        const mergedData = (theoMergedProteins) ? theoMergedProteins : proteinData

        return <g>
            { _.map(mergedData, (p, i) => this.plotOneProteinMerge(p, proteinData[i])) }
            { this.plotSliceBars() }
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
    datasets: PropTypes.object.isRequired,
    getMousePos: PropTypes.func.isRequired,
    datasetChanged: PropTypes.number.isRequired,
};

export default ProteinMerges