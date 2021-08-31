import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HelpModal from "../common/HelpModal";

class PeptideHelpModal extends PureComponent {

  render() {
    const { modal, toggle } = this.props;

    const items = [
      {
        title: "Peptide Help",
        src: "/images/help_movies/gel_click_title.gif",
        text: [
          "You can open the selected protein in a new browser tab by clicking on the title.",
        ],
      },
    ];

    return (
      <HelpModal items={items} modal={modal} toggle={toggle} title={"Lanes help"}>
      </HelpModal>
    );
  }
}

PeptideHelpModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default PeptideHelpModal;
