import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash';
import { connect } from 'react-redux'
import PeptideViz from './PeptideViz'
import {changePepZoomRange, removePepPopup, showPepPopup} from "../../actions/peptideVizActions";
import {mouseLeaveSample} from "../../actions/sampleSelection";
import {setLegendPos} from "../../actions/legendActions";
import {setShowOnlyRazor, setShowOnlyUnique, showOptionsMenu} from "../../actions/menuActions";

class PeptideVizContainer extends Component {

    render(){
        const {proteinData, sequenceData, zoom, changeZoomRangeCB, clickedSlices, mouseOverSampleId,
            mouseOverReplId, mouseLeaveSampleCB, showPopupCB, removePopupCB, popup, datasets, legendPos, setLegendPos,
            legendIsMoving, datasetChanged, selectedOption, showOptionsMenu, showOnlyRazor, showOnlyUnique,
            setShowOnlyRazor, setShowOnlyUnique, peptideMenuMaxIntensity} = this.props

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
                                         clickedSlices={clickedSlices}
                                         samples={samples}
                                         mouseOverSampleId={mouseOverSampleId}
                                         mouseOverReplId={mouseOverReplId}
                                         mouseLeaveSampleCB={mouseLeaveSampleCB}
                                         showPopupCB={showPopupCB}
                                         removePopupCB={removePopupCB}
                                         popup={popup}
                                         datasets={datasets}
                                         legendPos={legendPos}
                                         setLegendPos={setLegendPos}
                                         legendIsMoving={legendIsMoving}
                                         datasetChanged={datasetChanged}
                                         selectedOption={selectedOption}
                                         showOptionsMenu={showOptionsMenu}
                                         showOnlyRazor={showOnlyRazor}
                                         showOnlyUnique={showOnlyUnique}
                                         setShowOnlyRazor={setShowOnlyRazor}
                                         setShowOnlyUnique={setShowOnlyUnique}
                                         peptideMenuMaxIntensity={peptideMenuMaxIntensity}
                            /> }
        </div>
    }

}

PeptideVizContainer.propTypes = {
    proteinData: PropTypes.array,
    sequenceData: PropTypes.object,
    zoom: PropTypes.object,
    changeZoomRangeCB: PropTypes.func.isRequired,
    clickedSlices: PropTypes.array.isRequired,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    popup: PropTypes.object,
    datasets: PropTypes.object.isRequired,
    legendPos: PropTypes.object,
    setLegendPos: PropTypes.func.isRequired,
    legendIsMoving: PropTypes.bool.isRequired,
    datasetChanged: PropTypes.number.isRequired,
    selectedOption: PropTypes.string,
    showOptionsMenu: PropTypes.func.isRequired,
    showOnlyRazor: PropTypes.bool.isRequired,
    showOnlyUnique: PropTypes.bool.isRequired,
    setShowOnlyRazor: PropTypes.func.isRequired,
    setShowOnlyUnique: PropTypes.func.isRequired,
    peptideMenuMaxIntensity: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        sequenceData: state.loadProtein.sequenceData,
        zoom: state.peptideViz.zoom,
        clickedSlices: state.sampleSelection.clickedSlices,
        mouseOverSampleId : state.sampleSelection.mouseOverSampleId,
        mouseOverReplId : state.sampleSelection.mouseOverReplId,
        popup: state.peptideViz.popup,
        datasets: state.loadProtein.datasets,
        legendPos: state.menu.legendPos,
        legendIsMoving: state.menu.legendIsMoving,
        datasetChanged: state.loadProtein.datasetChanged,
        selectedOption: state.menu.selectedOption,
        showOnlyRazor: state.menu.showOnlyRazor,
        showOnlyUnique: state.menu.showOnlyUnique,
        peptideMenuMaxIntensity: state.menu.peptideMenuMaxIntensity,

    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeZoomRangeCB: (left, right, top, bottom) => dispatch(changePepZoomRange(left, right, top, bottom)),
        mouseLeaveSampleCB: () => { dispatch(mouseLeaveSample()) },
        showPopupCB: (popup) => { dispatch(showPepPopup(popup))},
        removePopupCB: () => { dispatch(removePepPopup())},
        setLegendPos: (view, x, y) => { dispatch(setLegendPos(view, x, y))},
        showOptionsMenu: (page) => { dispatch(showOptionsMenu(page)) },
        setShowOnlyRazor: (showOnlyRazor) => { dispatch(setShowOnlyRazor(showOnlyRazor))},
        setShowOnlyUnique: (showOnlyUnique) => { dispatch(setShowOnlyUnique(showOnlyUnique))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeptideVizContainer)

