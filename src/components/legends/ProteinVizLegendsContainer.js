import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProteinVizLegends from './ProteinVizLegends'
import {
    mouseLeaveRepl, mouseLeaveSample, mouseOverRepl, mouseOverSample
} from "../../actions/sampleSelection";
import {reloadProtein, selectDataset, setDatasets} from "../../actions/loadProtein"
import {setMoveLegend} from "../../actions/legendActions";

class ProteinVizLegendsContainer extends Component {

    render(){
        const {x, y, width, theoMolWeight, mouseOverSampleId, mouseOverSampleCB,
            mouseOverReplId, mouseOverReplCB, mouseLeaveReplCB, mouseLeaveSampleCB, mouseClickReplCB,
            datasets, reloadProteinCB, setDatasets, legendIsMoving, setMoveLegend, datasetChanged} = this.props

        return <ProteinVizLegends x={x} y={y} width={width} theoMolWeight={theoMolWeight}
                                 mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                                 mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}
                                 mouseLeaveReplCB={mouseLeaveReplCB} mouseLeaveSampleCB={mouseLeaveSampleCB}
                                 mouseClickReplCB={mouseClickReplCB}
                                 datasets={datasets} reloadProteinCB={reloadProteinCB} setDatasets={setDatasets}
                                 legendIsMoving={legendIsMoving} setMoveLegend={setMoveLegend} datasetChanged={datasetChanged}
                >
                </ProteinVizLegends>
    }

}

ProteinVizLegendsContainer.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    theoMolWeight: PropTypes.number.isRequired,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    reloadProteinCB: PropTypes.func.isRequired,
    setDatasets: PropTypes.func.isRequired,
    legendIsMoving: PropTypes.bool.isRequired,
    setMoveLegend: PropTypes.func.isRequired,
    datasetChanged: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        mouseOverSampleId : state.sampleSelection.mouseOverSampleId,
        mouseOverReplId : state.sampleSelection.mouseOverReplId,
        datasets: state.loadProtein.datasets,
        legendIsMoving: state.legend.legendIsMoving,
        datasetChanged: state.loadProtein.datasetChanged
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        mouseOverSampleCB: sampleIdx => { dispatch(mouseOverSample(sampleIdx)) },
        mouseOverReplCB: replIdx => { dispatch(mouseOverRepl(replIdx)) },
        mouseLeaveSampleCB: () => { dispatch(mouseLeaveSample()) },
        mouseLeaveReplCB: () => { dispatch(mouseLeaveRepl()) },
        mouseClickReplCB: (sampleIdx, replIdx) => { dispatch(selectDataset(sampleIdx, replIdx)) },
        reloadProteinCB: (activeDatasetIds, callOnComplete) => { dispatch(reloadProtein(activeDatasetIds, callOnComplete))},
        setDatasets: (datasets) => { dispatch(setDatasets(datasets)) },
        setMoveLegend: (isMoving) => { dispatch(setMoveLegend(isMoving))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinVizLegendsContainer)

