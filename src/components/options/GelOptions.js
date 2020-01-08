import React, {
    PureComponent,
} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {Input, Col, Row} from 'reactstrap'
import {showOptionsMenu} from "../../actions/menuActions";

class GelOptions extends PureComponent {

    render() {
        return <div className={"options-menu"}>
            <h6>Options for lane plots</h6>
            
        </div>
    }
}

GelOptions.propTypes = {
};

const mapStateToProps = (state) => {
    const props = {
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GelOptions);