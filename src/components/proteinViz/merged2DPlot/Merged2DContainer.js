import React, {
    Component
} from 'react'
import * as _ from 'lodash';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Merged2DPlot from "./Merged2DPlot";
import {mouseOverSample, mouseOverRepl} from "../../../actions/sampleSelection";

class Merged2DContainer extends Component {

    render(){
        const {proteinData, mouseOverSampleId, mouseOverSampleCB, mouseOverReplId, mouseOverReplCB} = this.props

        const samples = _.map(proteinData, (p, i) => {
            const replicates = _.map(p.proteins, (oneProt, i) => {
                return { idx: i, name: oneProt.dataSet.name }
            })
            return { idx: i, name: p.sample, replicates: replicates }
        })

        return <Merged2DPlot proteinData={proteinData} samples={samples} viewWidth={800} viewHeight={400}
                             mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                             mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}/>
    }

}

Merged2DContainer.propTypes = {
    proteinData: PropTypes.array,
    mouseOverSampleId: PropTypes.number,
    mouseOverReplId: PropTypes.number,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    const props = {
        mouseOverSampleId : state.sampleSelection.mouseOverSampleId,
        mouseOverReplId : state.sampleSelection.mouseOverReplId
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        mouseOverSampleCB: sampleIdx => {
            dispatch(mouseOverSample(sampleIdx))
        },
        mouseOverReplCB: replIdx => {
            dispatch(mouseOverRepl(replIdx))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Merged2DContainer)

