import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GelViz from './GelViz'
import {selectAllDatasets, selectDataset} from "../../actions/loadProtein";

class GelVizContainer extends PureComponent {

    render(){
        const {
            proteinData,
            datasets,
            datasetChanged,
            mouseClickSampleCB,
            mouseClickReplCB,
            gelContrast,
            isoforms
        } = this.props

        return <div id={"gel-viz"}>
            { proteinData && <GelViz proteinData={proteinData}
                                     datasets={datasets}
                                     datasetChanged={datasetChanged}
                                     viewWidth={800}
                                     viewHeight={400}
                                     mouseClickSampleCB={mouseClickSampleCB}
                                     mouseClickReplCB={mouseClickReplCB}
                                     gelContrast={gelContrast}
                                     isoforms={isoforms}
            /> }
        </div>
    }
}

GelVizContainer.propTypes = {
    proteinData: PropTypes.array,
    datasets: PropTypes.object.isRequired,
    datasetChanged: PropTypes.number.isRequired,
    mouseClickSampleCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    gelContrast: PropTypes.number.isRequired,
    isoforms: PropTypes.array
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        datasets: state.loadProtein.datasets,
        datasetChanged: state.loadProtein.datasetChanged,
        gelContrast: state.menu.gelContrast,
        isoforms: state.loadProtein.isoforms
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        mouseClickSampleCB: (sampleIdx) => { dispatch(selectAllDatasets(sampleIdx, "gel")) },
        mouseClickReplCB: (sampleIdx, replIdx) => { dispatch(selectDataset(sampleIdx, replIdx, "gel")) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GelVizContainer)

