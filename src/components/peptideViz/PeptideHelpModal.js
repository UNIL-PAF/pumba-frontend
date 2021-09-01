import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HelpModal from "../common/HelpModal";

class PeptideHelpModal extends PureComponent {

  render() {
    const { modal, toggle } = this.props;

    const items = [
      {
        title: "Zoom into region of interest",
        src: "/images/help_movies/peptide_zoom.gif",
        text: [
          "You can zoom into a region of the peptide graph by clicking and holding the left mouse button, and thus determing the new plot area.",
          "To zoom out again you just have to double click on any place within the graph.",
        ],
      },
      {
        title: "Data selection",
        src: "/images/help_movies/peptide_data_selection.gif",
        text: [
          "In the legend you can hide whole cell lines or remove a single replicate from the graph.",
        ],
      },
    ];

    return (
      <HelpModal items={items} modal={modal} toggle={toggle} title={"Peptides help"}>
      </HelpModal>
    );
  }
}

PeptideHelpModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default PeptideHelpModal;
