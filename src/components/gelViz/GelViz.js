import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import GelSlice from "../gelViz/GelSlice"


class GelViz extends PureComponent {


    plotOneGel = () => {
        const {proteinData, datasets} = this.props

        return <div>
            <GelSlice
            proteinData={proteinData}
            datasets={datasets}
            viewWidth={100}
            viewHeight={400}></GelSlice>
        </div>
    }

    render() {
        const {proteinData, datasets} = this.props

        console.log(proteinData)
        console.log(datasets)

        return <div id={"gel-plot"}>
            </div>
    }

}

GelViz.propTypes = {
    proteinData: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
};

export default GelViz