import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Merged2DPlot from "./merged2DPlot/Merged2DPlot";

class ProteinVizContainer extends Component {

    render(){
        const {proteinData} = this.props

        return <div>
            { proteinData && <Merged2DPlot proteinData={proteinData} width={800} height={300}/> }
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

