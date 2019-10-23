import {
    REQUEST_PROTEIN, PROTEIN_IS_LOADED, ADD_PROTEIN_DATA, PROTEIN_LOAD_ERROR,
    GOTO_VIZ, ADD_SEQUENCE_DATA, SET_DATASETS, SET_SORTED_DATASET_NAMES, SELECT_DATASET, SELECT_ALL_DATASETS
} from '../actions/loadProtein'
import * as _ from 'lodash';

const initialState = {
    proteinIsLoading: false,
    proteinData: null,
    datasetChanged: 0
}

const selectDataset = (state, sampleIdx, replIdx) => {
    const newState = {...state}
    const newDatasets = _.map(newState.datasets[sampleIdx].datasets, (d) => {
        if(d.id === replIdx) d.isSelected = !d.isSelected
        return d
    })
    newState.datasets[sampleIdx].datasets = newDatasets
    newState.datasetChanged += 1
    return newState
}

const selectAllDatasets= (state, sampleIdx) => {
    const newState = {...state}
    // if any of the datasets is already selected, we unselect all of them
    const anySelected = _.some(newState.datasets[sampleIdx].datasets, 'isSelected')

    const newDatasets = _.map(newState.datasets[sampleIdx].datasets, (d) => {
        d.isSelected = (anySelected ? false : true)
        return d
    })

    newState.datasets[sampleIdx].datasets = newDatasets
    newState.datasetChanged += 1
    return newState
}



const loadProteinReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_PROTEIN:
            return { ...state, proteinIsLoading: true }
        case PROTEIN_IS_LOADED:
            return { ...state, proteinIsLoading: false, finishedLoading: true}
        case ADD_PROTEIN_DATA:
            return { ...state, proteinData: action.proteinData}
        case ADD_SEQUENCE_DATA:
            return { ...state, sequenceData: action.sequenceData}
        case PROTEIN_LOAD_ERROR:
            return { ...state, error: action.error}
        case SET_DATASETS:
            return { ...state, datasets: action.datasets}
        case GOTO_VIZ:
            return { ...state, gotoViz: action.gotoViz}
        case SET_SORTED_DATASET_NAMES:
            return { ...state, datasetNames: action.datasetNames}
        case SELECT_DATASET:
            return selectDataset(state, action.sampleIdx, action.replIdx)
        case SELECT_ALL_DATASETS:
            return selectAllDatasets(state, action.sampleIdx)
        default:
            return state
    }
}

export default loadProteinReducer
