import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class ProteinVizContainer extends Component {
    render(){

        return <div>
            <div>{this.props.proteinData ? this.props.proteinData.length : 0 }</div>
        </div>
    }

}

ProteinVizContainer.propTypes = {
    proteinData: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    console.log(state.loadProtein.proteinData)

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

