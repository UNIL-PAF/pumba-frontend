import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {fetchProtein, gotoViz, fetchDatasets, setDatasets} from '../../actions/loadProtein'
import ProteinSearchButton from "./ProteinSearchButton";
import ProteinSearchInput from "./ProteinSearchInput";
import {Form, FormGroup, Col, Row, Label, Input} from 'reactstrap'
import * as _ from 'lodash';

class ProteinSearchContainer extends React.Component{

    constructor(props) {
        super(props);
        this.changeSampleChecked = this.changeSampleChecked.bind(this);
        this.loadProtein = this.loadProtein.bind(this);
    }

    componentDidMount() {
        const {datasets, loadDatasets} = this.props

        // Autoloading for testing
        // this.props.onLoadProtein("P02786")

        // load the list of datasets
        if(! datasets) loadDatasets()

    }

    componentDidUpdate() {
        const {gotoViz, history, gotoProteinViz} = this.props

        // let's move to the ProteinViz, but only once
        if (gotoViz){
            history.push('/lanes')
            gotoProteinViz(false)
        }
    }

    keyClicked = (e) => {
        if(e.key === "Enter"){
            this.loadProtein()
            e.preventDefault();
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
        const newDataset = {...datasets, [event.target.id]: {
                isChecked: !datasets[event.target.id].isChecked,
                datasets: datasets[event.target.id].datasets,
                idx: datasets[event.target.id].idx,
                isAvailable: datasets[event.target.id].isAvailable,
                isActive: datasets[event.target.id].isActive,
            }
        }
        setDatasets(newDataset)
    }

    loadProtein() {
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

        onLoadProtein(this.state.searchString, availableDatasets.join(','))
    }

    render(){
        const {proteinIsLoading, error, datasets, datasetNames} = this.props

        return <div>
            <br/>
            <Row>
                <Col className="text-center" md={{ size: 4, offset: 4 }}>
                    <h2>Search for protein AC</h2>
                </Col>
            </Row>

            <br/>

            <Form>
                <FormGroup>
                    <ProteinSearchInput
                        onChange={this.onChangeInput}
                        disabled={proteinIsLoading}
                        onEnterClicked={this.loadProtein}
                    />
                </FormGroup>
                <Row>
                    <Col className="text-center" md={{ size: 4, offset: 4 }}>
                        {datasets && _.map(datasetNames, (name) => {
                            return this.oneSample(name, datasets[name].isChecked)
                        })}
                    </Col>
                </Row>
                <br/>
                <FormGroup>
                        <ProteinSearchButton
                            onClick={this.loadProtein}
                            disabled={proteinIsLoading}
                        />
                </FormGroup>
                {error && <div>{error}</div>}
            </Form>
        </div>
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
    datasetNames: PropTypes.array
};

const mapStateToProps = (state) => {
    const props = {
        proteinIsLoading: state.loadProtein.proteinIsLoading,
        proteinData: state.loadProtein.proteinData,
        error: state.loadProtein.error,
        gotoViz: state.loadProtein.gotoViz,
        datasets: state.loadProtein.datasets,
        datasetNames: state.loadProtein.datasetNames
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadProtein: (proteinId, availableDatasets) => { dispatch(fetchProtein(proteinId, availableDatasets)) },
        gotoProteinViz: (letsGo) => { dispatch(gotoViz(letsGo)) },
        loadDatasets: () => { dispatch(fetchDatasets()) },
        setDatasets: (datasets) => { dispatch(setDatasets(datasets)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinSearchContainer)

