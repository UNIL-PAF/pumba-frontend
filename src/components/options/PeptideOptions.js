import React, {
    PureComponent,
} from 'react';
import { connect } from 'react-redux'
import {Button} from 'reactstrap'
import {setShowOnlyRazor, setShowOnlyUnique} from "../../actions/menuActions";
import PropTypes from 'prop-types'

class PeptideOptions extends PureComponent {

    movingSlider = (bounds) => {
        if(bounds) this.props.setProteinMenuMaxIntensity(bounds)
    }

    setToDefault = () => {
        const {setShowOnlyUnique, setShowOnlyRazor} = this.props
        setShowOnlyRazor(false)
        setShowOnlyUnique(false)
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
        const {showOnlyRazor, showOnlyUnique} = this.props

        return <div className={"options-menu"}>
            <p style={{minWidth: "160px"}}><span><strong>Peptide graph options</strong></span>&nbsp;&nbsp;
                <span><Button color="primary" size={"sm"} onClick={() => this.setToDefault()}>Reset</Button></span>
            </p>
            <p><input type={"checkbox"} checked={showOnlyRazor} onChange={this.clickShowOnlyRazor} />
                <span>Show only razor peptides.</span>
            </p>
            <p><input type={"checkbox"} checked={showOnlyUnique} onChange={this.clickShowOnlyUnique} />
                <span>Show only unique peptides (unique by group).</span>
            </p>
        </div>
    }
}

PeptideOptions.propTypes = {
    showOnlyRazor: PropTypes.bool.isRequired,
    showOnlyUnique: PropTypes.bool.isRequired,
    setShowOnlyRazor: PropTypes.func.isRequired,
    setShowOnlyUnique: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        showOnlyRazor: state.menu.showOnlyRazor,
        showOnlyUnique: state.menu.showOnlyUnique,
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        setShowOnlyRazor: showOnlyRazor => { dispatch(setShowOnlyRazor(showOnlyRazor)) },
        setShowOnlyUnique: showOnlyUnique => { dispatch(setShowOnlyUnique(showOnlyUnique)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeptideOptions);