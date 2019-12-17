import React, {
    PureComponent,
} from 'react';
import PropTypes from 'prop-types';

class ProteinTitle extends PureComponent {

    render() {
        const { proteinData, x, y } = this.props;

        var proteinStr = proteinData[0].mainProteinId
        const geneNames = proteinData[0].proteins[0].geneNames.join(', ')

        if(geneNames){
            proteinStr += " (" + geneNames + ")"
        }

        return <g>
            <text
                className={"protein-title unselecteable"}
                x={typeof x !== 'undefined' ? x : 80}
                y={typeof y !== 'undefined' ? y : 20}
            >
                {proteinStr}</text>
        </g>
    }
}

ProteinTitle.propTypes = {
    proteinData: PropTypes.array.isRequired,
    x: PropTypes.number,
    y: PropTypes.number
};

export default ProteinTitle