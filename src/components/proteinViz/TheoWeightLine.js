import React, {
    PureComponent,
} from 'react';
import PropTypes from 'prop-types';

class TheoWeightLine extends PureComponent {

    render() {
        const { xPos, yTop, height } = this.props;

        return <line
            className="theo-weight-line"
            x1={xPos}
            y1={yTop}
            x2={xPos}
            y2={ height ? height : 0 }
        />

    }
}

TheoWeightLine.propTypes = {
    xPos: PropTypes.number.isRequired,
    yTop: PropTypes.number.isRequired,
    height: PropTypes.number
};

export default (TheoWeightLine);