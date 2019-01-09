import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import {Button, Col, Row} from 'reactstrap'
import LoadingSvgIcon from '../common/loadingSvgIcon'

class ProteinSearchButton extends Component {

    render(){
        return <div>
            <Row>
                <Col className="text-center" md={{ size: 4, offset: 4 }}>
                    <span>
                        <LoadingSvgIcon iconHeight={20} iconWidth={20} hide={!this.props.disabled}></LoadingSvgIcon>
                        &nbsp;
                        <Button color="primary" onClick={this.props.onClick} disabled={this.props.disabled}>Search</Button>
                    </span>
                </Col>
            </Row>
        </div>
    }

}


ProteinSearchButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
};

export default ProteinSearchButton