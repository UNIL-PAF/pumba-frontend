import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

class TheoWeightLine extends Component {
    
    render() {
        const { xPos, yTop } = this.props;

        return <line
            className="theo-weight-line"
            x1={xPos}
            y1={yTop}
            x2={xPos}
            y2={0}
        />

    }
}

TheoWeightLine.propTypes = {
    xPos: PropTypes.number.isRequired,
    yTop: PropTypes.number.isRequired
};

export default (TheoWeightLine);