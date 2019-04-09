import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash';
import { connect } from 'react-redux'
import ProteinVizPlot from "./ProteinVizPlot";
import {
    mouseClickRepl, mouseLeaveRepl, mouseLeaveSample, mouseOverRepl, mouseOverSample,
    removeRepl, clickSlice, unclickSlice
} from "../../actions/sampleSelection";
import {changeZoomAndFilter, removeSlicePopup, showSlicePopup} from "../../actions/proteinVizActions";
import {reloadProtein, setDatasets} from "../../actions/loadProtein";

class ProteinVizContainer extends Component {

    render(){
        const {proteinData, mouseOverSampleId, mouseOverSampleCB,
            mouseOverReplId, mouseOverReplCB, mouseLeaveSampleCB, mouseLeaveReplCB,
            zoomLeft, zoomRight, changeZoomRangeCB, theoMergedProteins, mouseClickReplCB,
            clickedRepl, removeSelectedReplCB, showPopupCB, removePopupCB, popup, clickedSlices,
            clickSliceCB, unclickSliceCB, history, datasets, reloadProtein, setDatasets} = this.props

        return <div id={"protein-viz"}>
        { proteinData && <ProteinVizPlot proteinData={proteinData} viewWidth={800} viewHeight={400}
                             mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                             mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}
                             mouseLeaveSampleCB={mouseLeaveSampleCB} mouseLeaveReplCB={mouseLeaveReplCB}
                             changeZoomRangeCB={changeZoomRangeCB} zoomLeft={zoomLeft} zoomRight={zoomRight}
                             theoMergedProteins={theoMergedProteins} mouseClickReplCB={mouseClickReplCB}
                             clickedRepl={clickedRepl} removeSelectedReplCB={removeSelectedReplCB}
                             showPopupCB={showPopupCB} removePopupCB={removePopupCB} popup={popup}
                             clickedSlices={clickedSlices} clickSliceCB={clickSliceCB} unclickSliceCB={unclickSliceCB}
                             history={history} datasets={datasets} reloadProtein={reloadProtein} setDatasets={setDatasets}
        /> }
        </div>
    }

}

ProteinVizContainer.propTypes = {
    proteinData: PropTypes.array,
    theoMergedProteins: PropTypes.array,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.number,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    changeZoomRangeCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    clickSliceCB: PropTypes.func.isRequired,
    unclickSliceCB: PropTypes.func.isRequired,
    clickedRepl: PropTypes.array.isRequired,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    popup: PropTypes.object,
    clickedSlices: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    reloadProtein: PropTypes.func.isRequired,
    setDatasets: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        mouseOverSampleId : state.sampleSelection.mouseOverSampleId,
        mouseOverReplId : state.sampleSelection.mouseOverReplId,
        clickedRepl : state.sampleSelection.clickedRepl,
        zoomLeft: state.proteinViz.zoomLeft,
        zoomRight: state.proteinViz.zoomRight,
        theoMergedProteins: state.proteinViz.theoMergedProteins,
        popup: state.proteinViz.popup,
        clickedSlices: state.sampleSelection.clickedSlices,
        datasets: state.loadProtein.datasets
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        mouseOverSampleCB: sampleIdx => { dispatch(mouseOverSample(sampleIdx)) },
        mouseOverReplCB: replIdx => { dispatch(mouseOverRepl(replIdx)) },
        mouseLeaveSampleCB: () => { dispatch(mouseLeaveSample()) },
        mouseLeaveReplCB: () => { dispatch(mouseLeaveRepl()) },
        mouseClickReplCB: (sampleIdx, replIdx) => { dispatch(mouseClickRepl(sampleIdx, replIdx)) },
        changeZoomRangeCB: (left, right) => { dispatch(changeZoomAndFilter(left, right)) },
        removeSelectedReplCB: (sampleIdx, replIdx) => { dispatch(removeRepl(sampleIdx, replIdx)) },
        showPopupCB: (popup) => { dispatch(showSlicePopup(popup))},
        removePopupCB: () => { dispatch(removeSlicePopup())},
        clickSliceCB: (slice) => { dispatch(clickSlice(slice))},
        unclickSliceCB: (slice) => { dispatch(unclickSlice(slice))},
        reloadProtein: (activeDatasets) => { dispatch(reloadProtein(activeDatasets)) },
        setDatasets: (datasets) => { dispatch(setDatasets(datasets)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinVizContainer)

