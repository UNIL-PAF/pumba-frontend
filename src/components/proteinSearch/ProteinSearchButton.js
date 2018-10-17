import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'

class ProteinSearchButton extends Component {

    render(){
        return <div>
            <button onClick={this.props.onClick}>ProteinSearch</button>
        </div>
    }

}


ProteinSearchButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default ProteinSearchButton