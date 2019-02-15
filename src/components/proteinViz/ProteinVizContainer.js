import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash';
import { connect } from 'react-redux'
import Merged2DPlot from "./ProteinVizPlot";
import {
    mouseClickRepl, mouseLeaveRepl, mouseLeaveSample, mouseOverRepl, mouseOverSample,
    removeRepl
} from "../../actions/sampleSelection";
import {changeZoomAndFilter} from "../../actions/proteinVizActions";

class ProteinVizContainer extends Component {


    render(){
        const {proteinData, mouseOverSampleId, mouseOverSampleCB,
            mouseOverReplId, mouseOverReplCB, mouseLeaveSampleCB, mouseLeaveReplCB,
            zoomLeft, zoomRight, changeZoomRangeCB, theoMergedProteins, mouseClickReplCB, clickedRepl, removeSelectedReplCB} = this.props

        const samples = _.map(proteinData, (p, i) => {
            const replicates = _.map(p.proteins, (oneProt, i) => {
                return { idx: i, name: oneProt.dataSet.name }
            })
            return { idx: i, name: p.sample, replicates: replicates }
        })

        return <div id={"protein-viz"}>
        { proteinData && <Merged2DPlot proteinData={proteinData} samples={samples} viewWidth={800} viewHeight={400}
                             mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                             mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}
                             mouseLeaveSampleCB={mouseLeaveSampleCB} mouseLeaveReplCB={mouseLeaveReplCB}
                             changeZoomRangeCB={changeZoomRangeCB} zoomLeft={zoomLeft} zoomRight={zoomRight}
                             theoMergedProteins={theoMergedProteins} mouseClickReplCB={mouseClickReplCB}
                             clickedRepl={clickedRepl} removeSelectedReplCB={removeSelectedReplCB}
        /> }
        </div>
    }

}

ProteinVizContainer.propTypes = {
    proteinData: PropTypes.array,
    theoMergedProteins: PropTypes.array,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    changeZoomRangeCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    clickedRepl: PropTypes.array.isRequired,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        mouseOverSampleId : state.sampleSelection.mouseOverSampleId,
        mouseOverReplId : state.sampleSelection.mouseOverReplId,
        clickedRepl : state.sampleSelection.clickedRepl,
        zoomLeft: state.merged2DPlot.zoomLeft,
        zoomRight: state.merged2DPlot.zoomRight,
        theoMergedProteins: state.merged2DPlot.theoMergedProteins
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinVizContainer)

