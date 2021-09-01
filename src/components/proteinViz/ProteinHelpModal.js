import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HelpModal from "../common/HelpModal";

class ProteinHelpModal extends PureComponent {

  render() {
    const { modal, toggle } = this.props;

    const items = [
      {
        title: "Zoom into graph",
        src: "/images/help_movies/protein_zoom.gif",
        text: [
          "You can zoom into the graph by clicking on the left mouse button and dragging while holding down the button. You have to release the button when you reached the desired position.",
          "To zoom out again, you simply double click on any place in the graph.",
        ],
      },
      {
        title: "Zoom into low intensity region",
        src: "/images/help_movies/protein_intensity_zoom.gif",
        text: [
          "When looking at a region with low intensities it can be useful adapt the zoom for the intensity (y-axis).",
          "You zoom by adapting the maximum intensity from the options menu.",
          "There is a reset button, to go back to the inital state.",
        ],
      },
      {
        title: "Data selection",
        src: "/images/help_movies/protein_data_selection.gif",
        text: [
          "In the legend you can hide whole cell lines or remove a single replicate from the graph.",
          "By moving the mouse pointer over the replicates you can see the individual intensities for each slice. The final curve for each cell line is created by an interpolation of those slice intensities.",
          "When you click on the name of a replicate, you can fix it and then get more information (e.g. number of peptides) for each slice by moving the mouse pointer on it."
        ],
      },
    ];

    return (
      <HelpModal items={items} modal={modal} toggle={toggle} title={"Graph help"}>
      </HelpModal>
    );
  }
}

ProteinHelpModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default ProteinHelpModal;
