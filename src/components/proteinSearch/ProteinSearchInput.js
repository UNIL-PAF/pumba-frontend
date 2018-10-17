import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'

class ProteinSearchInput extends Component {

    render(){
        return <div>
            <input onChange={this.props.onChange} placeholder={"A0A096LP01"}></input>
        </div>
    }

}

ProteinSearchInput.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default ProteinSearchInput