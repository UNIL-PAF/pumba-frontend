import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {fetchProtein, gotoViz, fetchDatasets, setDatasets, addProteinData, fetchSuggestions} from '../../actions/loadProtein'
import {setOrganism} from '../../actions/menuActions'
import ProteinSearchButton from "./ProteinSearchButton";
import ProteinSearchInput from "./ProteinSearchInput";
import {Form, FormGroup, Col, Row, Label, Input, Button, ButtonGroup} from 'reactstrap'
import * as _ from 'lodash';

class ProteinSearchContainer extends React.Component{

    constructor(props) {
        super(props);
        this.changeSampleChecked = this.changeSampleChecked.bind(this);
        this.loadProtein = this.loadProtein.bind(this);
    }

    componentDidMount() {
        const {datasets, loadDatasets, organism} = this.props

        // Autoloading for testing
        // this.props.onLoadProtein("P02786")

        // load the list of datasets
        if(! datasets) loadDatasets(organism)

    }

    componentDidUpdate() {
        const {gotoViz, history, gotoProteinViz} = this.props

        // let's move to the ProteinViz, but only once
        if (gotoViz){
            history.push('/lanes/')
            gotoProteinViz(false)
        }
    }

    keyClicked = (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            this.loadProtein()
        }
    }

    oneSample(sample, isAvailable) {
        return <FormGroup check inline key={sample}>
                <Label check>
                    <Input
                        id={sample}
                        type="checkbox"
                        checked={isAvailable}
                        onChange={this.changeSampleChecked}
                        onKeyPress={this.keyClicked}
                    />{sample}
                </Label>
            </FormGroup>
    }

    changeSampleChecked(event) {
        const {datasets, setDatasets} = this.props
        const newDataset = {
          ...datasets,
          [event.target.id]: {
            isChecked: !datasets[event.target.id].isChecked,
            datasets: datasets[event.target.id].datasets,
            idx: datasets[event.target.id].idx,
            isAvailable: datasets[event.target.id].isAvailable,
            isActive: datasets[event.target.id].isActive,
            organism: datasets[event.target.id].organism,
            name: datasets[event.target.id].name,
            colorGroup: datasets[event.target.id].colorGroup,
          },
        };
        setDatasets(newDataset)
    }

    loadProtein(proteinId) {
        const {onLoadProtein, datasets} = this.props

        const availableDatasets = _.reduce(datasets, (res, val) => {
            if(val.isChecked) res = res.concat(_.map(val.datasets, 'id'))
            return res
        }, [])

        // set isAvailable and isActive to the value found in isChecked
        const newDatasets = _.mapValues(datasets, (d) => {
                d.isAvailable = d.isChecked
                d.isActive = d.isChecked
                d.datasets = _.map(d.datasets, (d2) => {
                    d2.isActive = true
                    return d2
                })
                return d
            })

        setDatasets(newDatasets)
        const finalSearchTerm = proteinId ? proteinId : this.state.searchString

        onLoadProtein(finalSearchTerm.trim(), availableDatasets.join(","));
    }

    render(){
        const {
          proteinIsLoading,
          datasets,
          datasetNames,
          organism,
          setOrganism,
          loadDatasets,
          resetProteinData,
          suggestions,
          fetchSuggestions
        } = this.props;

        const changeOrganism = (organism) => {
            setOrganism(organism)
            loadDatasets(organism)
            resetProteinData()
        }

        const datasetsLoaded = (datasets && datasetNames && true)

        return (
          <div>
            <br />
            <Row>
              <Col className="text-center" md={{ size: 4, offset: 4 }}>
                <h4>Organism</h4>
              </Col>
            </Row>
            <Row>
              <Col className="text-center" md={{ size: 4, offset: 4 }}>
                <ButtonGroup>
                  <Button
                    active={organism === "human"}
                    color="primary"
                    outline={true}
                    onClick={() => changeOrganism("human")}
                  >
                    Human
                  </Button>
                  <Button
                    active={organism === "mouse"}
                    color="primary"
                    outline={true}
                    onClick={() => changeOrganism("mouse")}
                  >
                    Mouse
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
            <br />

            <Row>
              <Col className="text-center" md={{ size: 6, offset: 3 }}>
                <h4>Search by UniProt accession number or gene name.</h4>
                <h6>Attention: Search is case sensitive.</h6>
              </Col>
            </Row>

            <br />

            <Form>
              <FormGroup>
                <ProteinSearchInput
                  onChange={this.onChangeInput}
                  disabled={proteinIsLoading}
                  onEnterClicked={this.loadProtein}
                  organism={organism}
                  suggestions={suggestions}
                  fetchSuggestions={fetchSuggestions}
                />
              </FormGroup>
              <Row>
                <Col className="text-center" md={{ size: 4, offset: 4 }}>
                  <h4>Cell lines</h4>
                </Col>
              </Row>
              <Row>
                <Col className="text-center" md={{ size: 4, offset: 4 }}>
                  {datasetsLoaded &&
                    _.map(datasetNames, (name) => {
                      if (!datasets[name]) return null;
                        return this.oneSample(name, datasets[name].isChecked);
                    })}
                </Col>
              </Row>
              <br />
              <FormGroup>
                <ProteinSearchButton
                  onClick={this.loadProtein}
                  disabled={proteinIsLoading}
                />
              </FormGroup>
            </Form>
          </div>
        );
    }

    onChangeInput = (e) => {
        this.setState({searchString: e.target.value})
    }

}

ProteinSearchContainer.propTypes = {
  proteinIsLoading: PropTypes.bool.isRequired,
  proteinData: PropTypes.array,
  error: PropTypes.string,
  gotoViz: PropTypes.bool,
  onLoadProtein: PropTypes.func.isRequired,
  gotoProteinViz: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loadDatasets: PropTypes.func.isRequired,
  setDatasets: PropTypes.func.isRequired,
  datasets: PropTypes.object,
  datasetNames: PropTypes.array,
  organism: PropTypes.string.isRequired,
  setOrganism: PropTypes.func.isRequired,
  resetProteinData: PropTypes.func.isRequired,
  suggestions: PropTypes.array
};

const mapStateToProps = (state) => {
    const props = {
        proteinIsLoading: state.loadProtein.proteinIsLoading,
        proteinData: state.loadProtein.proteinData,
        error: state.loadProtein.error,
        gotoViz: state.loadProtein.gotoViz,
        datasets: state.loadProtein.datasets,
        datasetNames: state.loadProtein.datasetNames,
        organism: state.menu.organism,
        suggestions: state.loadProtein.suggestions
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
      onLoadProtein: (proteinId, availableDatasets) => {
        dispatch(fetchProtein(proteinId, availableDatasets));
      },
      gotoProteinViz: (letsGo) => {
        dispatch(gotoViz(letsGo));
      },
      loadDatasets: (organism) => {
        dispatch(fetchDatasets(organism));
      },
      setDatasets: (datasets) => {
        dispatch(setDatasets(datasets));
      },
      setOrganism: (organism) => {
        dispatch(setOrganism(organism));
      },
      resetProteinData: () => {
        dispatch(addProteinData(null));
      },
      fetchSuggestions: (term, organism) => {
        dispatch(fetchSuggestions(term, organism));
      },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinSearchContainer)

