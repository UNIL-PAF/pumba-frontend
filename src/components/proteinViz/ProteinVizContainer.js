import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Merged2DContainer from "./merged2DPlot/Merged2DContainer";

class ProteinVizContainer extends Component {

    render(){
        const {proteinData} = this.props

        return <div id={"protein-viz"}>
            { proteinData && <Merged2DContainer proteinData={proteinData} /> }
        </div>
    }

}

ProteinVizContainer.propTypes = {
    proteinData: PropTypes.array
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinVizContainer)

