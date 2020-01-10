import React, {
    PureComponent,
} from 'react';
import { connect } from 'react-redux'
import Slider from 'rc-slider';
import {Button} from 'reactstrap'
import {setProteinMenuMaxIntensity} from "../../actions/menuActions";
import PropTypes from 'prop-types'

class ProteinOptions extends PureComponent {

    movingSlider = (bounds) => {
        if(bounds) this.props.setProteinMenuMaxIntensity(bounds)
    }

    setToDefault = () => {
        const {maxIntensity, setProteinMenuMaxIntensity} = this.props
        setProteinMenuMaxIntensity(maxIntensity)
    }

    render() {
        const {maxIntensity, proteinMenuMaxIntensity} = this.props

        // get the intensity from the proteinData if non is provided from the options
        const currentMaxIntensity = proteinMenuMaxIntensity ? proteinMenuMaxIntensity : maxIntensity

        return <div className={"options-menu"}>
            <p style={{minWidth: "160px"}}><span><strong>Protein graph options</strong></span>&nbsp;&nbsp;
                <span><Button color="primary" size={"sm"} onClick={() => this.setToDefault()}>Reset</Button></span>
            </p>
            <p>Max intensity {currentMaxIntensity.toExponential(1)}</p>
            <Slider
                min={0}
                max={maxIntensity}
                value={currentMaxIntensity}
                step={1e-5}
                onChange={(bounds) => this.movingSlider(bounds)}
                trackStyle={{backgroundColor: '#007bff'}}
                handleStyle={{borderColor: '#007bff'}}
            />
        </div>
    }
}

ProteinOptions.propTypes = {
    proteinMenuMaxIntensity: PropTypes.number,
    maxIntensity: PropTypes.number,
    setProteinMenuMaxIntensity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        proteinMenuMaxIntensity: state.menu.proteinMenuMaxIntensity,
        maxIntensity: state.loadProtein.maxIntensity,
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        setProteinMenuMaxIntensity: maxIntensity => { dispatch(setProteinMenuMaxIntensity(maxIntensity)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinOptions);