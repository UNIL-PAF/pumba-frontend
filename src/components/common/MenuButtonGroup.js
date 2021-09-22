import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ExportSvgButton from "../common/ExportSvgButton";
import { Button } from "reactstrap";
import GelOptions from "../options/GelOptions";
import { GearFill, InfoCircleFill } from "react-bootstrap-icons";
import GelHelpModal from "../gelViz/GelHelpModal";
import ProteinOptions from "../options/ProteinOptions";
import PeptideOptions from "../options/PeptideOptions";
import ProteinHelpModal from "../proteinViz/ProteinHelpModal";
import PeptideHelpModal from "../peptideViz/PeptideHelpModal";

class MenuButtonGroup extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showHelpModal: false,
      showOptionsMenu: false,
    };
  }

  optionsButton() {
    const { selectedViz } = this.props;

    if (selectedViz === "lanes") {
      return <GelOptions close={this.toggleOptions}></GelOptions>;
    }else if(selectedViz === "proteins"){
      return <ProteinOptions close={this.toggleOptions}></ProteinOptions>;
    }else if(selectedViz === "peptides"){
      return <PeptideOptions close={this.toggleOptions}></PeptideOptions>;
    }
  }

  helpModal() {
    const { selectedViz } = this.props;
    const { showHelpModal } = this.state;

      if (selectedViz === "lanes") {
        return (
          <GelHelpModal
            toggle={this.toggleHelp}
            modal={showHelpModal}
          ></GelHelpModal>
        );
      }else if (selectedViz === "proteins"){
        return (
          <ProteinHelpModal
            toggle={this.toggleHelp}
            modal={showHelpModal}
          ></ProteinHelpModal>
        );
      }else if(selectedViz === "peptides"){
          return <PeptideHelpModal
            toggle={this.toggleHelp}
            modal={showHelpModal}
          ></PeptideHelpModal>;
      }
  }

  fileName() {
    const { selectedViz, proteinId } = this.props;
    return proteinId + "-" + selectedViz;
  }

  toggleHelp = () => {
    this.setState({ showHelpModal: !this.state.showHelpModal });
  };

  toggleOptions = () => {
    this.setState({ showOptionsMenu: !this.state.showOptionsMenu });
  };

  render() {
    const { svg } = this.props;
    const { showOptionsMenu } = this.state;

    return (
      <div id={"gel-option-group"}>
        <Button
          active={showOptionsMenu}
          color="primary"
          onClick={() => this.toggleOptions()}
        >
          <span>
            <GearFill />
          </span>
          &nbsp; Options
        </Button>
        &nbsp;
        {showOptionsMenu && this.optionsButton()}
        <ExportSvgButton
          svg={svg}
          fileName={this.fileName()}
        ></ExportSvgButton>
        &nbsp;
        <Button color="primary" onClick={() => this.toggleHelp()}>
          <span>
            <InfoCircleFill />
          </span>
          &nbsp; Help
        </Button>
        { this.helpModal() }
      </div>
    );
  }
}

MenuButtonGroup.propTypes = {
  selectedViz: PropTypes.string.isRequired,
  svg: PropTypes.object.isRequired,
  proteinId: PropTypes.string.isRequired,
};

export default MenuButtonGroup;
