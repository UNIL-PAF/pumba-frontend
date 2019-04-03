import React, {
    PureComponent,
} from 'react';
import PropTypes from 'prop-types';

class ProteinTitle extends PureComponent {

    render() {
        const { proteinData } = this.props;

        var proteinStr = proteinData[0].mainProteinId
        const geneNames = proteinData[0].proteins[0].geneNames.join(', ')

        if(geneNames){
            proteinStr += " (" + geneNames + ")"
        }

        return <g>
            <text
                className={"protein-title"}
                x={80}
                y={20}
            >
                {proteinStr}</text>
        </g>
    }
}

ProteinTitle.propTypes = {
    proteinData: PropTypes.array.isRequired
};

export default ProteinTitle