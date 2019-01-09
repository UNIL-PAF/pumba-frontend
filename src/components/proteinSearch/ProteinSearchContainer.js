import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {fetchProtein, gotoViz} from '../../actions/loadProtein'
import ProteinSearchButton from "./ProteinSearchButton";
import ProteinSearchInput from "./ProteinSearchInput";
import {Form, FormGroup, Col, Row} from 'reactstrap'

class ProteinSearchContainer extends React.Component{

    componentDidMount() {
        // Autoloading for testing
        // this.props.onLoadProtein("P02786")
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
            <br/>
            <Row>
                <Col className="text-center" md={{ size: 4, offset: 4 }}>
                    <h2>Search for protein AC</h2>
                </Col>
            </Row>

            <br/>
            <br/>

            <Form>
                <FormGroup>
                    <ProteinSearchInput onChange={this.onChangeInput} disabled={this.props.proteinIsLoading}/>
                </FormGroup>
                <FormGroup>
                        <ProteinSearchButton onClick={() => this.props.onLoadProtein(this.state.searchString)} disabled={this.props.proteinIsLoading} />
                </FormGroup>
                <div>{this.props.error}</div>
            </Form>
        </div>
    }

    onChangeInput = (e) => {
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

