import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProteinVizPlot from "./ProteinVizPlot";
import { mouseLeaveSample, clickSlice, unclickSlice} from "../../actions/sampleSelection";
import {changeZoomAndFilter, removeSlicePopup, showSlicePopup} from "../../actions/proteinVizActions";
import {setLegendPos} from "../../actions/legendActions";
import {showOptionsMenu} from "../../actions/menuActions";

class ProteinVizContainer extends Component {

    render(){
        const {proteinData, mouseOverSampleId, mouseOverReplId, mouseLeaveSampleCB, zoomLeft, zoomRight,
            changeZoomRangeCB, theoMergedProteins, showOptionsMenu,
            showPopupCB, removePopupCB, popup, clickedSlices, proteinMenuMaxIntensity, selectedOption,
            clickSliceCB, unclickSliceCB, history, datasets, legendPos, setLegendPos, legendIsMoving, proteinMaxIntensity,
            sequenceData} = this.props

        return <div id={"protein-viz"}>
        { proteinData && <ProteinVizPlot proteinData={proteinData} viewWidth={1000} viewHeight={400}
                             mouseOverSampleId={mouseOverSampleId} selectedOption={selectedOption}
                             mouseOverReplId={mouseOverReplId} showOptionsMenu={showOptionsMenu}
                             mouseLeaveSampleCB={mouseLeaveSampleCB}
                             changeZoomRangeCB={changeZoomRangeCB} zoomLeft={zoomLeft} zoomRight={zoomRight}
                             theoMergedProteins={theoMergedProteins}
                             showPopupCB={showPopupCB} removePopupCB={removePopupCB} popup={popup}
                             clickedSlices={clickedSlices} clickSliceCB={clickSliceCB} unclickSliceCB={unclickSliceCB}
                             history={history} datasets={datasets} legendPos={legendPos} setLegendPos={setLegendPos}
                             legendIsMoving={legendIsMoving} proteinMaxIntensity={proteinMaxIntensity} proteinMenuMaxIntensity={proteinMenuMaxIntensity}
                                         sequenceData={sequenceData}
        /> }
        </div>
    }

}

ProteinVizContainer.propTypes = {
    proteinData: PropTypes.array,
    theoMergedProteins: PropTypes.array,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    changeZoomRangeCB: PropTypes.func.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    clickSliceCB: PropTypes.func.isRequired,
    unclickSliceCB: PropTypes.func.isRequired,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    popup: PropTypes.object,
    clickedSlices: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    legendPos: PropTypes.object,
    setLegendPos: PropTypes.func.isRequired,
    legendIsMoving: PropTypes.bool.isRequired,
    proteinMaxIntensity: PropTypes.number.isRequired,
    proteinMenuMaxIntensity: PropTypes.number,
    selectedOption: PropTypes.string,
    showOptionsMenu: PropTypes.func.isRequired,
    sequenceData: PropTypes.object
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        mouseOverSampleId : state.sampleSelection.mouseOverSampleId,
        mouseOverReplId : state.sampleSelection.mouseOverReplId,
        zoomLeft: state.proteinViz.zoomLeft,
        zoomRight: state.proteinViz.zoomRight,
        theoMergedProteins: state.proteinViz.theoMergedProteins,
        popup: state.proteinViz.popup,
        clickedSlices: state.sampleSelection.clickedSlices,
        datasets: state.loadProtein.datasets,
        legendPos: state.menu.legendPos,
        legendIsMoving: state.menu.legendIsMoving,
        proteinMaxIntensity: state.loadProtein.proteinMaxIntensity,
        proteinMenuMaxIntensity: state.menu.proteinMenuMaxIntensity,
        selectedOption: state.menu.selectedOption,
        sequenceData: state.loadProtein.sequenceData,
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        mouseLeaveSampleCB: () => { dispatch(mouseLeaveSample()) },
        changeZoomRangeCB: (left, right) => { dispatch(changeZoomAndFilter(left, right)) },
        showPopupCB: (popup) => { dispatch(showSlicePopup(popup))},
        removePopupCB: () => { dispatch(removeSlicePopup())},
        clickSliceCB: (slice) => { dispatch(clickSlice(slice))},
        unclickSliceCB: (slice) => { dispatch(unclickSlice(slice))},
        setLegendPos: (view, x, y) => { dispatch(setLegendPos(view, x, y))},
        showOptionsMenu: (page) => { dispatch(showOptionsMenu(page)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinVizContainer)

