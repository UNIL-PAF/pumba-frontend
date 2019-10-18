import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GelViz from './GelViz'

class GelVizContainer extends PureComponent {

    render(){
        const {proteinData, datasets} = this.props

        return <div id={"gel-viz"}>
            { proteinData && <GelViz proteinData={proteinData}
                                     datasets={datasets}
                                     viewWidth={800}
                                     viewHeight={400}
            /> }
        </div>
    }

}

GelVizContainer.propTypes = {
    proteinData: PropTypes.array,
    datasets: PropTypes.object,
    datasetNames: PropTypes.array,
};

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        datasets: state.loadProtein.datasets
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GelVizContainer)

