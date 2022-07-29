import React, {PureComponent} from 'react'
import {fetchOneProtein} from "../../actions/loadProtein";
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
        console.log(proteinData)
        console.log(datasets)
        if(proteinData && datasets && sequenceData) history.push('/lanes')
    }

    render() {

        return <div>
            <Row>
                <Col className="text-center" md={{size: 4, offset: 4}}>
                    <h5><LoadingSvgIcon iconHeight={25} iconWidth={25} hide={false}></LoadingSvgIcon>
                        &nbsp;Loading {this.props.match.params.id}...
                    </h5>
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
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProtein: (proteinId) => {
            dispatch(fetchOneProtein(proteinId))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadEntry)

