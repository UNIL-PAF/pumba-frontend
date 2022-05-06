import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import MergedGelSlice from "./MergedGelSlice"
import DatasetGelSlice from "./DatasetGelSlice"

class GelSlice extends PureComponent {

    plotSlice = () => {
        const {mergedData} = this.props

        if(mergedData){
            return this.plotMergedData()
        }else{
            return this.plotDatasetData()
        }
    }

    plotDatasetData = () => {
        const {xPos, yPos, sliceWidth, proteinData, amplify, maxInt, yScale, greyScale, getMousePos} = this.props
        
        if(! proteinData) return null

        const newDatasetData = {massFits: proteinData.dataSet.massFitResult.massFits, intensities: proteinData.intensities}

        return <DatasetGelSlice
            datasetData={newDatasetData}
            sliceWidth={sliceWidth}
            xPos={xPos}
            yPos={yPos}
            maxInt={maxInt}
            yScale={yScale}
            amplify={amplify}
            greyScale={greyScale}
            getMousePos={getMousePos}
        >
        </DatasetGelSlice>
    }

    plotMergedData = () => {
        const {xPos, yPos, sliceWidth, sliceHeight, mergedData, amplify, maxInt, yScale, greyScale} = this.props

        return <MergedGelSlice
            mergedData={mergedData}
            sliceWidth={sliceWidth}
            sliceHeight={sliceHeight}
            xPos={xPos}
            yPos={yPos}
            maxInt={maxInt}
            yScale={yScale}
            amplify={amplify}
            greyScale={greyScale}
        >
        </MergedGelSlice>
    }

    onMouseClick = () => {
        const {mouseClickCB, sampleName} = this.props

        if(mouseClickCB){
            mouseClickCB(sampleName)
        }
    }

    onMouseEnter = () => {
        const {onMouseEnterCB, sampleName} = this.props

        // call the callback if it's there
        if(onMouseEnterCB){
            onMouseEnterCB(sampleName)
        }
    }

    onMouseLeave = () => {
        const {onMouseLeaveCB} = this.props

        // call the callback if it's there
        if(onMouseLeaveCB){
            onMouseLeaveCB()
        }
    }

    render() {
        const {xPos, yPos, sliceWidth, sliceHeight, title, subTitle, mergedData, proteinData} = this.props

        const rectStyle = (mergedData ? {cursor: 'pointer'} : {})

        const isFirstAC = (!proteinData || proteinData.isFirstAC) ? "" : "*"

        return <g key={'gel-slice-' + title}
                  onMouseEnter={() => this.onMouseEnter()}
                  onMouseLeave={() => this.onMouseLeave()}
                >
                    <rect
                        className={'gel-slice'}
                        width={sliceWidth}
                        height={sliceHeight}
                        transform={'translate(' + xPos + ',' + yPos + ')'}
                        onClick={() => this.onMouseClick()}
                        style={rectStyle}
                    >
                    </rect>
                    <g transform={'translate(' + (xPos+10) + ',' + (yPos-10) + ') rotate(-45)'}>
                            <text className={mergedData ? 'gel-title-merged' : 'gel-title-sample'}>{title}</text>
                            <text y={10} className={mergedData ? 'gel-subtitle-merged' : 'gel-subtitle-sample'}>{subTitle + isFirstAC}</text>
                    </g>
                    {this.plotSlice()}
                </g>
    }


}

GelSlice.propTypes = {
    mergedData: PropTypes.object,
    datasetData: PropTypes.array,
    sliceWidth: PropTypes.number.isRequired,
    sliceHeight: PropTypes.number.isRequired,
    xPos: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    maxInt: PropTypes.number.isRequired,
    amplify: PropTypes.number.isRequired,
    yScale: PropTypes.func.isRequired,
    greyScale: PropTypes.func.isRequired,
    mouseClickCB: PropTypes.func,
    sampleName: PropTypes.string,
    replId: PropTypes.string,
    mouseClickReplCB: PropTypes.func,
    onMouseEnterCB: PropTypes.func,
    onMouseLeaveCB: PropTypes.func,
    getMousePos: PropTypes.func,
    proteinData: PropTypes.object
};

export default GelSlice