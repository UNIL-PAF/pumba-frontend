import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash';
import { connect } from 'react-redux'
import PeptideViz from './PeptideViz'
import {changePepZoomRange, removePepPopup, showPepPopup} from "../../actions/peptideVizActions";
import {mouseLeaveSample} from "../../actions/sampleSelection";

class PeptideVizContainer extends Component {

    render(){
        const {proteinData, sequenceData, zoom, changeZoomRangeCB, clickedRepl, clickedSlices, mouseOverSampleId,
            mouseOverReplId, mouseLeaveSampleCB, showPopupCB, removePopupCB, popup, datasets} = this.props

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
                                         mouseOverSampleId={mouseOverSampleId}
                                         mouseOverReplId={mouseOverReplId}
                                         mouseLeaveSampleCB={mouseLeaveSampleCB}
                                         showPopupCB={showPopupCB}
                                         removePopupCB={removePopupCB}
                                         popup={popup}
                                         datasets={datasets}
                            /> }
        </div>
    }

}

PeptideVizContainer.propTypes = {
    proteinData: PropTypes.array,
    sequenceData: PropTypes.object,
    zoom: PropTypes.object,
    changeZoomRangeCB: PropTypes.func.isRequired,
    clickedRepl: PropTypes.array.isRequired,
    clickedSlices: PropTypes.array.isRequired,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    popup: PropTypes.object,
    datasets: PropTypes.object.isRequired,
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
        mouseLeaveSampleCB: () => { dispatch(mouseLeaveSample()) },
        showPopupCB: (popup) => { dispatch(showPepPopup(popup))},
        removePopupCB: () => { dispatch(removePepPopup())},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeptideVizContainer)

