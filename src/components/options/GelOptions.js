import React, {
    PureComponent,
} from 'react';
import { connect } from 'react-redux'
import Slider from 'rc-slider';
import {Button} from 'reactstrap'
import {setGelContrast} from "../../actions/menuActions";
import pumbaConfig from '../../config'
import PropTypes from 'prop-types'

class GelOptions extends PureComponent {

    movingSlider = (bounds) => {
        this.props.setGelContrast(bounds)
    }

    setToDefault = () => {
        this.props.setGelContrast(pumbaConfig.initialGelContrast)
    }

    render() {
        const {gelContrast} = this.props

        const contrastPercent = Math.round(100 / pumbaConfig.maxGelContrast * gelContrast)

        return <div className={"options-menu"}>
            <p style={{minWidth: "160px"}}><span><strong>Lane options</strong></span>&nbsp;&nbsp;
                <span><Button color="primary" size={"sm"} onClick={() => this.setToDefault()}>Reset</Button></span>
            </p>
            <p>Contrast {contrastPercent}%</p>
            <Slider
                min={0.5}
                max={pumbaConfig.maxGelContrast}
                value={gelContrast}
                step={0.5}
                onChange={(bounds) => this.movingSlider(bounds)}
                trackStyle={{backgroundColor: '#007bff'}}
                handleStyle={{borderColor: '#007bff'}}
            />
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