import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import Autosuggest from "react-autosuggest";

class ProteinSearchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      highlighted: null
    };
  }

  keyClicked = (e) => {
    if (e.key === "Enter") {
        if(this.props.suggestions.length === 0 || !this.state.highlighted){
            this.props.onEnterClicked(this.state.value);
            e.preventDefault();
            e.stopPropagation();
        }
    }
  };

  getSuggestions = (value) => {
    const {fetchSuggestions, organism} = this.props
    fetchSuggestions(value, organism);
  };

  onSuggestionsFetchRequested = ({ value }) => {
    if (value.trim().length >= 3) {
      this.getSuggestions(value);
    } else {
      this.getSuggestions();
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
      this.getSuggestions();
  };

  onSuggestionHighlighted = (e) => {
    this.setState({highlighted: e.suggestion ? e.suggestion.proteinId : undefined})
  }

  onSuggestionSelect = (e, { suggestion, suggestionValue, index, method }) => {
    const {value} = this.state
    const lowValue = value.toLowerCase()

    if(suggestion.proteinId.toLowerCase().includes(lowValue)){
      this.setState({
        value: suggestion.proteinId
      });
    }else{
      this.setState({
        value: suggestion.geneName
      });
    }

    this.props.onEnterClicked(suggestion.proteinId);
  };

  getSuggestionValue = (suggestion) => {
    return this.state.value;
  };

  renderSuggestion = (suggestion) => {
    const { value } = this.state;

    const lcVal = this.state.value.toLowerCase();
    const fastaString = suggestion.string;
    const lcFastaString = fastaString.toLowerCase();
    const hitPos = lcFastaString.indexOf(lcVal);
    const highlightedString = (
      <span>
        {fastaString.slice(0, hitPos)}
        <strong>
          <em>{fastaString.slice(hitPos, hitPos + value.length)}</em>
        </strong>
        {fastaString.slice(hitPos + value.length - fastaString.length)}
      </span>
    );

    return <div>{highlightedString}</div>;
  };

  onChange = (event, { newValue }) => {
    this.props.onChange(event);
    this.setState({
      value: newValue,
    });
  };

  render() {
    const { organism, suggestions } = this.props;
    const { value } = this.state;

    const inputProps = {
      placeholder: organism === "human" ? "e.g. MAPK1" : "",
      value,
      onChange: this.onChange,
      onKeyDown: this.keyClicked,
    };

    return (
      <div>
        <Row>
          <Col className="text-center" md={{ size: 4, offset: 4 }}>
            <Autosuggest
              inputProps={inputProps}
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              onSuggestionSelected={this.onSuggestionSelect}
              onSuggestionHighlighted={this.onSuggestionHighlighted}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

ProteinSearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onEnterClicked: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  organism: PropTypes.string.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  suggestions: PropTypes.array,
};

export default ProteinSearchInput;
