import React, {PureComponent} from 'react'
import {fetchOneProtein, inactivateMissingDatasets, setDatasets} from "../../actions/loadProtein";
import {connect} from "react-redux";
import LoadingSvgIcon from "../common/loadingSvgIcon";
import {Col, Row} from 'reactstrap'

class LoadEntry extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.props.fetchProtein(this.props.match.params.id);
            this.setState({isLoading: true})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {proteinData, datasets, history, sequenceData} = this.props
        const link = this.props.match.params.type ? this.props.match.params.type : 'lanes'
        if(proteinData && datasets && sequenceData){
            inactivateMissingDatasets(datasets, proteinData)
            history.push('/' + link + '/' + this.props.match.params.id)
        }
    }

    renderLoading(){
        return  <h5><LoadingSvgIcon iconHeight={25} iconWidth={25} hide={false}></LoadingSvgIcon>
            &nbsp;Loading {this.props.match.params.id}...
        </h5>
    }

    renderError(){
        return <h5>
            Failed to load {this.props.match.params.id}.
        </h5>
    }

    render() {

        return <div>
            <Row>
                <Col className="text-center" md={{size: 4, offset: 4}}>
                    { this.state.isLoading && !this.props.error && this.renderLoading()}
                    { this.props.error && this.renderError()}
                </Col>
            </Row>
        </div>
    }
}

const mapStateToProps = (state) => {
    const props = {
        proteinData: state.loadProtein.proteinData,
        datasets: state.loadProtein.datasets,
        sequenceData: state.loadProtein.sequenceData,
        error: state.loadProtein.error
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProtein: (proteinId) => {
            dispatch(fetchOneProtein(proteinId))
        },
        inactivateMissingDatasets: (origDatasets, proteinMerges) => {
            dispatch(setDatasets(inactivateMissingDatasets(origDatasets, proteinMerges)))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadEntry)

