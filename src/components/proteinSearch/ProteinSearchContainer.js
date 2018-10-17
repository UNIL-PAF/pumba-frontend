import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProtein } from '../../actions/loadProtein'
import ProteinSearchButton from "./ProteinSearchButton";
import ProteinSearchInput from "./ProteinSearchInput";

class ProteinSearchContainer extends Component {
    render(){

        return <div>
            <div>ProteinSearch</div>
            <div>{this.props.proteinIsLoading ? "loading" : "not loading"}</div>
            <ProteinSearchInput onChange={this.onChangeInput}/>
            <ProteinSearchButton onClick={() => this.props.onLoadProtein(this.state.searchString)} />
            <div>{this.props.proteinData ? this.props.proteinData.length : 0 }</div>
            <div>{this.props.error}</div>
        </div>
    }

    onChangeInput = (e) => {
        console.log("new search string", e.target.value)
        this.setState({searchString: e.target.value})
    }

}

ProteinSearchContainer.propTypes = {
    proteinIsLoading: PropTypes.bool.isRequired,
    proteinData: PropTypes.array.isRequired,
    error: PropTypes.string
};

const mapStateToProps = (state) => {
    console.log(state.loadProtein.proteinData)

    const props = {
        proteinIsLoading: state.loadProtein.proteinIsLoading,
        proteinData: state.loadProtein.proteinData,
        error: state.loadProtein.error
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadProtein: proteinId => {
            dispatch(fetchProtein(proteinId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinSearchContainer)

