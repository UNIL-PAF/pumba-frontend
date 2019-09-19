import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clickSlice, unclickSlice} from "../../actions/sampleSelection";
import {removeSlicePopup, showSlicePopup} from "../../actions/proteinVizActions";
import ProteinMerges from "./ProteinMerges";

class ProteinMergesContainer extends PureComponent {

    render(){
        const {proteinData, mouseOverSampleId, mouseOverReplId, zoomLeft, zoomRight,
            theoMergedProteins, clickedRepl, showPopupCB, removePopupCB, popup, clickedSlices,
            clickSliceCB, unclickSliceCB, history, datasets, xScale, yScale, margin, svgParent,
            scaleChanged, getMousePos} = this.props

        return <ProteinMerges proteinData={proteinData} theoMergedProteins={theoMergedProteins}
                              unclickSliceCB={unclickSliceCB} clickSliceCB={clickSliceCB}
                              mouseOverSampleId={mouseOverSampleId} mouseOverReplId={mouseOverReplId}
                              zoomLeft={zoomLeft} zoomRight={zoomRight} clickedRepl={clickedRepl}
                              showPopupCB={showPopupCB} removePopupCB={removePopupCB} popup={popup}
                              clickedSlices={clickedSlices} history={history} xScale={xScale}
                              yScale={yScale} margin={margin} svgParent={svgParent}
                              scaleChanged={scaleChanged} datasets={datasets} getMousePos={getMousePos}>
        </ProteinMerges>
    }

}

ProteinMergesContainer.propTypes = {
    proteinData: PropTypes.array,
    theoMergedProteins: PropTypes.array,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
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
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    margin: PropTypes.object.isRequired,
    svgParent: PropTypes.object.isRequired,
    scaleChanged: PropTypes.number.isRequired,
    getMousePos: PropTypes.func.isRequired
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
        showPopupCB: (popup) => { dispatch(showSlicePopup(popup))},
        removePopupCB: () => { dispatch(removeSlicePopup())},
        clickSliceCB: (slice) => { dispatch(clickSlice(slice))},
        unclickSliceCB: (slice) => { dispatch(unclickSlice(slice))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinMergesContainer)

