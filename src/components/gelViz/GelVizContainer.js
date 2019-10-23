import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GelViz from './GelViz'
import {selectAllDatasets} from "../../actions/loadProtein";

class GelVizContainer extends PureComponent {

    render(){
        const {proteinData, datasets, datasetChanged, mouseClickSampleCB} = this.props

        return <div id={"gel-viz"}>
            { proteinData && <GelViz proteinData={proteinData}
                                     datasets={datasets}
                                     datasetChanged={datasetChanged}
                                     viewWidth={800}
                                     viewHeight={400}
                                     mouseClickSampleCB={mouseClickSampleCB}
            /> }
        </div>
    }
}

GelVizContainer.propTypes = {
    proteinData: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    datasetChanged: PropTypes.number.isRequired,
    mouseClickSampleCB: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        datasets: state.loadProtein.datasets,
        datasetChanged: state.loadProtein.datasetChanged,
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        mouseClickSampleCB: (sampleIdx) => { dispatch(selectAllDatasets(sampleIdx)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GelVizContainer)

