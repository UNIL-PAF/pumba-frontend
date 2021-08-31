import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HelpModal from "../common/HelpModal";

class ProteinHelpModal extends PureComponent {

  render() {
    const { modal, toggle } = this.props;

    const items = [
      {
        title: "Protein Help",
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

ProteinHelpModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default ProteinHelpModal;
