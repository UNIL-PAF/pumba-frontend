import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash';
import { connect } from 'react-redux'
import PeptideViz from './PeptideViz'
import {changePepZoomRange, removePepPopup, showPepPopup} from "../../actions/peptideVizActions";
import {
    mouseClickRepl, mouseLeaveRepl, mouseLeaveSample, mouseOverRepl,
    mouseOverSample, removeRepl
} from "../../actions/sampleSelection";
import {reloadProtein} from "../../actions/loadProtein"

class PeptideVizContainer extends Component {

    render(){
        const {proteinData, sequenceData, zoom, changeZoomRangeCB, clickedRepl, clickedSlices, mouseOverSampleId,
            mouseOverSampleCB, mouseOverReplId, mouseOverReplCB, mouseLeaveReplCB, mouseLeaveSampleCB,
            mouseClickReplCB, removeSelectedReplCB, showPopupCB, removePopupCB, popup, datasets, reloadProteinCB} = this.props

        const samples = _.map(proteinData, (p, i) => {
            const replicates = _.map(p.proteins, (oneProt, i) => {
                return { idx: i, name: oneProt.dataSet.name }
            })
            return { idx: i, name: p.sample, replicates: replicates }
        })

        return <div id={"peptide-viz"}>
            { proteinData && <PeptideViz proteinData={proteinData}
                                         sequenceData={sequenceData}
                                         viewWidth={800}
                                         viewHeight={400}
                                         zoom={zoom}
                                         changeZoomRangeCB={changeZoomRangeCB}
                                         clickedRepl={clickedRepl}
                                         clickedSlices={clickedSlices}
                                         samples={samples}
                                         mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                                         mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}
                                         mouseLeaveReplCB={mouseLeaveReplCB} mouseLeaveSampleCB={mouseLeaveSampleCB}
                                         mouseClickReplCB={mouseClickReplCB} removeSelectedReplCB={removeSelectedReplCB}
                                         showPopupCB={showPopupCB} removePopupCB={removePopupCB} popup={popup}
                                         datasets={datasets} reloadProteinCB={reloadProteinCB}
                            /> }
        </div>
    }

}

PeptideVizContainer.propTypes = {
    proteinData: PropTypes.array,
    sequenceData: PropTypes.object,
    zoom: PropTypes.object,
    clickedRepl: PropTypes.array.isRequired,
    clickedSlices: PropTypes.array.isRequired,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    popup: PropTypes.object,
    datasets: PropTypes.object.isRequired,
    reloadProteinCB: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        sequenceData: state.loadProtein.sequenceData,
        zoom: state.peptideViz.zoom,
        clickedRepl : state.sampleSelection.clickedRepl,
        clickedSlices: state.sampleSelection.clickedSlices,
        mouseOverSampleId : state.sampleSelection.mouseOverSampleId,
        mouseOverReplId : state.sampleSelection.mouseOverReplId,
        popup: state.peptideViz.popup,
        datasets: state.loadProtein.datasets
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeZoomRangeCB: (left, right, top, bottom) => dispatch(changePepZoomRange(left, right, top, bottom)),
        mouseOverSampleCB: sampleIdx => { dispatch(mouseOverSample(sampleIdx)) },
        mouseOverReplCB: replIdx => { dispatch(mouseOverRepl(replIdx)) },
        mouseLeaveSampleCB: () => { dispatch(mouseLeaveSample()) },
        mouseLeaveReplCB: () => { dispatch(mouseLeaveRepl()) },
        mouseClickReplCB: (sampleIdx, replIdx) => { dispatch(mouseClickRepl(sampleIdx, replIdx)) },
        removeSelectedReplCB: (sampleIdx, replIdx) => { dispatch(removeRepl(sampleIdx, replIdx)) },
        showPopupCB: (popup) => { dispatch(showPepPopup(popup))},
        removePopupCB: () => { dispatch(removePepPopup())},
        reloadProteinCB: (activeDatasetIds) => { dispatch(reloadProtein(activeDatasetIds))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeptideVizContainer)

