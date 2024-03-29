import React, {
    PureComponent,
} from 'react';
import { connect } from 'react-redux'
import Slider from 'rc-slider';
import {Button} from 'reactstrap'
import {setGelContrast, setShowIsoforms} from "../../actions/menuActions";
import pumbaConfig from '../../config'
import PropTypes from 'prop-types'

class GelOptions extends PureComponent {

    movingSlider = (bounds) => {
        this.props.setGelContrast(bounds)
    }

    setToDefault = () => {
        this.props.setGelContrast(pumbaConfig.initialGelContrast)
    }

    clickShowIsoforms = (e) => {
        const {showIsoforms, setShowIsoforms} = this.props
        setShowIsoforms(! showIsoforms)
    }


    render() {
        const {gelContrast, showIsoforms, close} = this.props

        const contrastPercent = Math.round(100 / pumbaConfig.maxGelContrast * gelContrast)

        return (
          <div id="gel-options-menu" className={"options-menu"}>
            <button
              style={{ marginTop: "-10px", marginRigth: "-10px" }}
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => close()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <p style={{ minWidth: "160px", textAlign: "left" }}>
              <span>
                <strong>Lane options</strong>
              </span>
              &nbsp;&nbsp;
              <span>
                <Button
                  color="primary"
                  size={"sm"}
                  onClick={() => this.setToDefault()}
                >
                  Reset
                </Button>
              </span>
            </p>
            <p className={"options-paragraph"}>
              Contrast {contrastPercent}%
              <Slider
                min={0.5}
                max={pumbaConfig.maxGelContrast}
                value={gelContrast}
                step={0.5}
                onChange={(bounds) => this.movingSlider(bounds)}
                trackStyle={{ backgroundColor: "#007bff" }}
                handleStyle={{ borderColor: "#007bff" }}
              />
            </p>
            <p className={"options-paragraph"}>
              <input
                type={"checkbox"}
                checked={showIsoforms}
                onChange={this.clickShowIsoforms}
              />
              <span className={"options-checkbox-span"}>
                Show theoretical MW of potential isoforms
              </span>
            </p>
          </div>
        );
    }
}

GelOptions.propTypes = {
  gelContrast: PropTypes.number.isRequired,
  showIsoforms: PropTypes.bool.isRequired,
  setGelContrast: PropTypes.func.isRequired,
  setShowIsoforms: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        gelContrast: state.menu.gelContrast,
        showIsoforms: state.menu.showIsoforms
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        setGelContrast: gelContrast => { dispatch(setGelContrast(gelContrast)) },
        setShowIsoforms: showIsoforms => { dispatch(setShowIsoforms(showIsoforms))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GelOptions);