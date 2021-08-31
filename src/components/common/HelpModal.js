import React, { PureComponent } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import * as _ from "lodash";
import PropTypes from "prop-types";

class GelHelpModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      animating: false,
    };
  }

  render() {
    const { modal, toggle, items, title} = this.props;
    const { activeIndex, animating } = this.state;

    const next = () => {
      if (animating) return;
      const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
      this.setState({ activeIndex: nextIndex });
    };

    const previous = () => {
      if (animating) return;
      const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
      this.setState({ activeIndex: nextIndex });
    };

    const goToIndex = (newIndex) => {
      if (animating) return;
      this.setState({ activeIndex: newIndex });
    };

    const slides = items.map((item) => {
      return (
        <CarouselItem
          onExiting={() => this.setState({ animating: true })}
          onExited={() => this.setState({ animating: false })}
          key={item.src}
        >
          <div className="help-text">
            <div id="inner-div">
              <h3>{item.title}</h3>
              <div>
                {_.map(item.text, (oneParagraph, i) => {
                  return (
                    <div>
                      <span key={i}>{oneParagraph}</span>
                      <br></br>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <hr />

          <img
            className="img-fluid"
            src={process.env.PUBLIC_URL + item.src}
            alt={item.altText}
          />
        </CarouselItem>
      );
    });

    return (
      <Modal isOpen={modal} toggle={toggle} className={"modal-xl"}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>
          <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            interval={null}
          >
            <CarouselIndicators
              items={items}
              activeIndex={activeIndex}
              onClickHandler={goToIndex}
            />
            {slides}
            <CarouselControl
              direction="prev"
              directionText="Previous"
              onClickHandler={previous}
            />
            <CarouselControl
              direction="next"
              directionText="Next"
              onClickHandler={next}
            />
          </Carousel>
        </ModalBody>
      </Modal>
    );
  }
}

GelHelpModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired
};

export default GelHelpModal;
