import fetch from 'cross-fetch'
import pumbaConfig from '../config'

export const PROTEIN_IS_LOADED = 'PROTEIN_IS_LOADED'
export const REQUEST_PROTEIN = 'REQUEST_PROTEIN'
export const ADD_PROTEIN_DATA = 'ADD_PROTEIN_DATA'
export const PROTEIN_LOAD_ERROR = 'PROTEIN_LOAD_ERROR'

export function fetchProtein(proteinId){
    return function (dispatch) {
        dispatch(requestProtein(proteinId))

        return fetch(pumbaConfig.urlBackend + "/proteins/" + proteinId )
            .then( response => {
                if (!response.ok) { throw response }
                return response.json()
            })
            .then(json => {
                    dispatch(addProteinData(json))
                    dispatch(proteinIsLoaded())
                }
            )
            .catch(err => {
                err.text().then(message => {
                    dispatch(proteinLoadError(err.statusText + ": " + message))
                })
            })
    }
}

export const addProteinData = (proteinData) => ({
    type: ADD_PROTEIN_DATA, proteinData: proteinData
})

export const requestProtein = (proteinId) => ({
    type: REQUEST_PROTEIN, proteinId: proteinId
})

export const proteinIsLoaded = (proteinData) => ({
    type: PROTEIN_IS_LOADED, proteinData: proteinData
})

export const proteinLoadError = (error) => ({
    type: PROTEIN_LOAD_ERROR, error: error
})
