import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import GelViz from './GelViz'
import {selectAllDatasets, selectDataset} from "../../actions/loadProtein";

class GelVizContainer extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            dataIsLoaded: false
        }
    }

    componentDidMount() {
        this.fetchDataOrUpdateURL()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(! this.state.dataIsLoaded){
            this.fetchDataOrUpdateURL()
        }
    }

    fetchDataOrUpdateURL(){
        if(this.props.proteinData){
            this.setState({dataIsLoaded: true})
            this.props.history.replace('/lanes/' + this.props.sequenceData.proteinId)
            this.setState({dataIsLoaded: true})
        }else{
            if(this.props.match.params.id){
                this.props.history.replace('/entry/' + this.props.match.params.id + '/lanes')
            }
        }
    }

    render(){
        const {
            proteinData,
            datasets,
            datasetChanged,
            mouseClickSampleCB,
            mouseClickReplCB,
            gelContrast,
            isoforms,
            sequenceData,
            showIsoforms,
            containsNotFirstAC
        } = this.props

        return <div id={"gel-viz"}>
            { proteinData && <GelViz proteinData={proteinData}
                                     datasets={datasets}
                                     datasetChanged={datasetChanged}
                                     viewWidth={1000}
                                     viewHeight={400}
                                     mouseClickSampleCB={mouseClickSampleCB}
                                     mouseClickReplCB={mouseClickReplCB}
                                     gelContrast={gelContrast}
                                     isoforms={isoforms}
                                     sequenceData={sequenceData}
                                     showIsoforms={showIsoforms}
                                     containsNotFirstAC={containsNotFirstAC}
            /> }
        </div>
    }
}

const mapStateToProps = (state) => {
    const props = {
        sequenceData: state.loadProtein.sequenceData,
        proteinData: state.loadProtein.proteinData,
        datasets: state.loadProtein.datasets,
        datasetChanged: state.loadProtein.datasetChanged,
        gelContrast: state.menu.gelContrast,
        isoforms: state.loadProtein.isoforms,
        showIsoforms: state.menu.showIsoforms,
        containsNotFirstAC: state.loadProtein.containsNotFirstAC
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        mouseClickSampleCB: (sampleIdx) => { dispatch(selectAllDatasets(sampleIdx, "gel")) },
        mouseClickReplCB: (sampleIdx, replIdx) => { dispatch(selectDataset(sampleIdx, replIdx, "gel")) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GelVizContainer)

