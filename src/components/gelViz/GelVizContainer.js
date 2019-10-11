import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash';
import { connect } from 'react-redux'
import GelViz from './GelViz'

class GelVizContainer extends PureComponent {

    render(){
        const {proteinData, datasets} = this.props

        console.log(proteinData)

        return <div id={"gel-viz"}>
            { proteinData && <GelViz proteinData={proteinData}
                                         datasets={datasets}

            /> }
        </div>
    }

}

GelVizContainer.propTypes = {
    proteinData: PropTypes.array,
    datasets: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        datasets: state.loadProtein.datasets,
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GelVizContainer)

