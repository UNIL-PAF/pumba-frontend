import React, {
    PureComponent,
} from 'react';
import { connect } from 'react-redux'
import Slider from 'rc-slider';
import {setGelContrast} from "../../actions/menuActions";
import PropTypes from 'prop-types'

class GelOptions extends PureComponent {

    maxValue = 30

    movingSlider = (bounds) => {
        this.props.setGelContrast(bounds)
    }

    render() {
        const {gelContrast} = this.props

        const contrastPercent = Math.round(100 / this.maxValue * gelContrast)

        return <div className={"options-menu"}>
            <p style={{minWidth: "160px"}}><strong>Lane options</strong></p>
            <p>Contrast {contrastPercent}%</p>
            <Slider min={0.5} max={this.maxValue} defaultValue={gelContrast} step={0.5} onChange={(bounds) => this.movingSlider(bounds)} railStyle={{widht: '400px;'}}/>
        </div>
    }
}

GelOptions.propTypes = {
    gelContrast: PropTypes.number.isRequired,
    setGelContrast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    const props = {
        gelContrast: state.menu.gelContrast
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        setGelContrast: gelContrast => { dispatch(setGelContrast(gelContrast)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GelOptions);