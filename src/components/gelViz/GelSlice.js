import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import MergedGelSlice from "./MergedGelSlice"
import DatasetGelSlice from "./DatasetGelSlice"
import CloseButton from "../common/CloseButton"


class GelSlice extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            showCloseButton: false
        }
    }

    plotSlice = () => {
        const {mergedData} = this.props

        if(mergedData){
            return this.plotMergedData()
        }else{
            return this.plotDatasetData()
        }
    }

    plotDatasetData = () => {
        const {xPos, yPos, sliceWidth, sliceHeight, datasetData, amplify, maxInt, yScale, greyScale} = this.props

        return <DatasetGelSlice
            datasetData={datasetData}
            sliceWidth={sliceWidth}
            sliceHeight={sliceHeight}
            xPos={xPos}
            yPos={yPos}
            maxInt={maxInt}
            yScale={yScale}
            amplify={amplify}
            greyScale={greyScale}
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
        const {datasetData} = this.props

        // only the close button when in dataset slice
        if(datasetData){
            this.setState({showCloseButton: true})
        }
    }

    onMouseLeave = () => {
        const {datasetData} = this.props

        // only the close button when in dataset slice
        if(datasetData){
            this.setState({showCloseButton: false})
        }
    }

    closeButtonCB = () => {
        const {mouseClickReplCB, sampleName, replId} = this.props
        mouseClickReplCB(sampleName, replId)
    }

    render() {
        const {xPos, yPos, sliceWidth, sliceHeight, title, subTitle, mergedData} = this.props

        const rectStyle = (mergedData ? {cursor: 'pointer'} : {})

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
                            <text fontSize={12} fontWeight={'bold'}>{title}</text>
                            <text y={10} fontSize={10}>{subTitle}</text>
                    </g>
                    {this.plotSlice()}
                    {this.state.showCloseButton && <CloseButton x={xPos+sliceWidth} y={yPos} onCloseCB={this.closeButtonCB}></CloseButton>}
                </g>
    }


}

GelSlice.propTypes = {
    mergedData: PropTypes.object,
    datasetData: PropTypes.object,
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
    mouseClickReplCB: PropTypes.func.isRequired
};

export default GelSlice