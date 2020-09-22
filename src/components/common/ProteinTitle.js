import React, {
    PureComponent,
} from 'react';
import PropTypes from 'prop-types';

class ProteinTitle extends PureComponent {

    openInNewTab() {
        const {sequenceData} = this.props;

        const url = "https://www.uniprot.org/uniprot/" + sequenceData.proteinId
        const win = window.open(url, '_blank');
        win.focus();
    }

    render() {
        const { x, y, sequenceData, onMouseEnter, onMouseLeave } = this.props;

        const proteinStr = sequenceData.proteinId + " - " + sequenceData.geneName + " - " + sequenceData.proteinName

        return <g onMouseEnter={()=>onMouseEnter()} onMouseLeave={() => onMouseLeave()}>
            <text
                className={"protein-title unselecteable"}
                x={typeof x !== 'undefined' ? x : 80}
                y={typeof y !== 'undefined' ? y : 20}
                onClick={() => this.openInNewTab()}
            >
                {proteinStr}</text>
        </g>
    }
}

ProteinTitle.propTypes = {
    sequenceData: PropTypes.object.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
};

export default ProteinTitle