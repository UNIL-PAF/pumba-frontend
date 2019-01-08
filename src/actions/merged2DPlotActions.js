import * as _ from 'lodash'

export const CHANGE_ZOOM_RANGE = 'CHANGE_ZOOM_RANGE'
export const CHANGE_THEO_MERGED_PROTEINS = 'CHANGE_THEO_MERGED_PROTEINS'

export function changeZoomAndFilter(left, right){
    return function (dispatch, getState) {
        const proteinData = getState().loadProtein.proteinData

        // filter the theo merged proteins by the zoom range
        const theoMergedProteins = _.map(proteinData, (pd) => {
            const zippedMerge = _.zip(pd.theoMergedProtein.theoMolWeights, pd.theoMergedProtein.intensities)
            const fltZippedMerge = _.filter(zippedMerge, (zm) => {
                return zm[0] >= left && zm[0] <= right
            })

            const unzippedMerge = _.unzip(fltZippedMerge)
            return {theoMergedProtein: {theoMolWeights: unzippedMerge[0], intensities: unzippedMerge[1]}}
        })

        dispatch(changeTheoMergedProteins(theoMergedProteins))
        dispatch(changeZoomRange(left, right))
    }
}

export const changeZoomRange = (left, right) => ({
    type: CHANGE_ZOOM_RANGE, left: left, right: right
})

export const changeTheoMergedProteins = (theoMergedProteins) => ({
    type: CHANGE_THEO_MERGED_PROTEINS, theoMergedProteins: theoMergedProteins
})



