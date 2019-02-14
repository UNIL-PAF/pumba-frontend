import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PeptideViz from './PeptideViz'
import {changePepZoomRange} from "../../actions/peptideVizActions";

class PeptideVizContainer extends Component {

    render(){
        const {proteinData, sequenceData, zoom, changeZoomRangeCB} = this.props

        return <div id={"peptide-viz"}>
            { proteinData && <PeptideViz proteinData={proteinData}
                                         sequenceData={sequenceData}
                                         viewWidth={800}
                                         viewHeight={400}
                                         zoom={zoom}
                                         changeZoomRangeCB={changeZoomRangeCB}
                            /> }
        </div>
    }

}

PeptideVizContainer.propTypes = {
    proteinData: PropTypes.array,
    sequenceData: PropTypes.object,
    zoom: PropTypes.object
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        sequenceData: state.loadProtein.sequenceData,
        zoom: state.peptideViz.zoom
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeZoomRangeCB: (left, right, top, bottom) => dispatch(changePepZoomRange(left, right, top, bottom))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeptideVizContainer)

