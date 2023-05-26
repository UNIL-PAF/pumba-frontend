import React, {Component,} from 'react';
import {Alert} from "reactstrap";
import {connect} from "react-redux";
import {setShowPumbaDescription} from "../../actions/commonInfo";

class PumbaDescription extends Component {
    render() {
        return <Alert color="warning" style={{marginBottom: 0, paddingBottom: 0}}
                      isOpen={this.props.showPumbaDescription} toggle={() => {
            this.props.setShowPumbaDescription(false)
        }}>
            <p>
                The PUMBA database is a resource of reference 1D-SDS-PAGE migration patterns for proteins from human and
                other organisms. <strong>Its purpose is to validate or troubleshoot western blot experiments</strong>,
                but also to provide information about proteoforms. For more information see <a
                href="https://doi.org/10.1016/j.jmb.2022.167933" target="_blank" rel="noopener noreferrer">Mylonas et al</a>.
            </p>
        </Alert>
    }
}

const mapStateToProps = (state) => {
    const props = {
        showPumbaDescription: state.commonInfo.showPumbaDescription,
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        setShowPumbaDescription: (showPumbaDescription) => {
            dispatch(setShowPumbaDescription(showPumbaDescription))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PumbaDescription)