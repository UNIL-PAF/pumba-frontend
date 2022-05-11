import React, {
    PureComponent,
} from 'react';
import { connect } from 'react-redux'
import {Button} from 'reactstrap'
import Slider from 'rc-slider';
import {setShowOnlyRazor, setShowOnlyUnique, setPeptideMenuMaxIntensity} from "../../actions/menuActions";
import PropTypes from 'prop-types'
import optionsConfig from './OptionsConfig'

class PeptideOptions extends PureComponent {

    movingSlider = (pos) => {
        this.props.setPeptideMenuMaxIntensity(pos)
    }

    setToDefault = () => {
        const {setShowOnlyUnique, setShowOnlyRazor, setPeptideMenuMaxIntensity} = this.props
        setShowOnlyRazor(false)
        setShowOnlyUnique(false)
        setPeptideMenuMaxIntensity(0)
    }

    clickShowOnlyRazor = (e) => {
        const {showOnlyRazor, setShowOnlyRazor} = this.props
        setShowOnlyRazor(! showOnlyRazor)
    }

    clickShowOnlyUnique = (e) => {
        const {showOnlyUnique, setShowOnlyUnique} = this.props
        setShowOnlyUnique(! showOnlyUnique)
    }

    render() {
        const {showOnlyRazor, showOnlyUnique, peptideMenuMaxIntensity, peptideMaxIntensity, peptideMinIntensity, close} = this.props
        const realIntValue = peptideMenuMaxIntensity ? (optionsConfig.computeRealIntValue(peptideMaxIntensity, peptideMinIntensity, peptideMenuMaxIntensity)).toExponential(1) : ''

        return (
          <div className={"options-menu"}>
            <button
              style={{ marginTop: "-10px", marginRigth: "-10px" }}
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => close()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <p style={{ minWidth: "160px", textAlign: "left" }}>
              <span>
                <strong>Peptide graph options</strong>
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
              <input
                type={"checkbox"}
                checked={showOnlyRazor}
                onChange={this.clickShowOnlyRazor}
              />
              <span className={"options-checkbox-span"}>
                Show only razor peptides
              </span>
            </p>
            <p className={"options-paragraph"}>
              <input
                type={"checkbox"}
                checked={showOnlyUnique}
                onChange={this.clickShowOnlyUnique}
              />
              <span className={"options-checkbox-span"}>
                Show only unique peptides
              </span>
            </p>
            <div className={"options-paragraph"}>
              Intensity threshold {realIntValue}
              <Slider
                min={0}
                max={optionsConfig.pepIntSliderSteps}
                value={peptideMenuMaxIntensity}
                step={0.5}
                onChange={(bounds) => this.movingSlider(bounds)}
                trackStyle={{ backgroundColor: "#e9e9e9" }}
                handleStyle={{ borderColor: "#007bff" }}
                railStyle={{ backgroundColor: "#007bff" }}
              />
            </div>
          </div>
        );
    }
}

PeptideOptions.propTypes = {
  showOnlyRazor: PropTypes.bool.isRequired,
  showOnlyUnique: PropTypes.bool.isRequired,
  setShowOnlyRazor: PropTypes.func.isRequired,
  setShowOnlyUnique: PropTypes.func.isRequired,
  peptideMaxIntensity: PropTypes.number,
  peptideMenuMaxIntensity: PropTypes.number.isRequired,
  setPeptideMenuMaxIntensity: PropTypes.func.isRequired,
  peptideMinIntensity: PropTypes.number,
  close: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        showOnlyRazor: state.menu.showOnlyRazor,
        showOnlyUnique: state.menu.showOnlyUnique,
        peptideMaxIntensity: state.loadProtein.peptideMaxIntensity,
        peptideMenuMaxIntensity: state.menu.peptideMenuMaxIntensity,
        peptideMinIntensity: state.loadProtein.peptideMinIntensity
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        setShowOnlyRazor: showOnlyRazor => { dispatch(setShowOnlyRazor(showOnlyRazor)) },
        setShowOnlyUnique: showOnlyUnique => { dispatch(setShowOnlyUnique(showOnlyUnique)) },
        setPeptideMenuMaxIntensity: maxInt => { dispatch(setPeptideMenuMaxIntensity(maxInt)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeptideOptions);