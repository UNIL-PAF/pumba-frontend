import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HelpModal from "../common/HelpModal";

class GelHelpModal extends PureComponent {

  render() {
    const { modal, toggle } = this.props;

    const items = [
      {
        title: "Open protein in UniProt",
        src: "/images/help_movies/gel_click_title.gif",
        text: [
          "You can open the selected protein in a new browser tab by clicking on the title.",
        ],
      },
      {
        title: "Look at individual replicates",
        src: "/images/help_movies/gel_expand_collapse.gif",
        text: [
          "The gels you see by default are merged from several replicates.",
          "You can look at the individual replicates by clicking on a gel and expand it.",
          "By clicking again you can collapse them.",
        ],
      },
      {
        title: "Lane Options",
        src: "/images/help_movies/gel_options.gif",
        text: [
          "You can set the contrast for the gels.",
          "You can show the theoretical molecular weight of potential isoforms. Those are the isoforms found in UniProt.",
        ],
      },
    ];

    return (
      <HelpModal items={items} modal={modal} toggle={toggle} title={"Lanes help"}>
      </HelpModal>
    );
  }
}

GelHelpModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default GelHelpModal;
