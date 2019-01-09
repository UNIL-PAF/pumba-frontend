import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import {Input, Col, Row} from 'reactstrap'

class ProteinSearchInput extends Component {

    render(){
        return <div>
            <Row>
                <Col className="text-center" md={{ size: 4, offset: 4 }}>
                    <Input type="search" onChange={this.props.onChange} placeholder={"e.g. P02786"} disabled={this.props.disabled}></Input>
                </Col>
            </Row>
        </div>
    }

}

ProteinSearchInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
};

export default ProteinSearchInput

