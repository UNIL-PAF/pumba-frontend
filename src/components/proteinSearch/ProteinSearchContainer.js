import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {fetchProtein, gotoViz} from '../../actions/loadProtein'
import ProteinSearchButton from "./ProteinSearchButton";
import ProteinSearchInput from "./ProteinSearchInput";

class ProteinSearchContainer extends React.Component{

    componentDidMount() {
        // Autoloading for testing
        this.props.onLoadProtein("P02786")
    }

    componentDidUpdate() {
        // let's move to the ProteinViz, but only once
        if (this.props.gotoViz){
            this.props.history.push('/proteins')
            this.props.gotoProteinViz(false)
        }
    }

    render(){
        return <div>
            <div>{this.props.proteinIsLoading ? "loading" : "not loading"}</div>
            <ProteinSearchInput onChange={this.onChangeInput}/>
            <ProteinSearchButton onClick={() => this.props.onLoadProtein(this.state.searchString)} />
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
    proteinData: PropTypes.array,
    error: PropTypes.string,
    gotoViz: PropTypes.bool
};

const mapStateToProps = (state) => {
    const props = {
        proteinIsLoading: state.loadProtein.proteinIsLoading,
        proteinData: state.loadProtein.proteinData,
        error: state.loadProtein.error,
        gotoViz: state.loadProtein.gotoViz
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadProtein: proteinId => {
            dispatch(fetchProtein(proteinId))
        },
        gotoProteinViz: (letsGo) => {
            dispatch(gotoViz(letsGo))
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinSearchContainer)

