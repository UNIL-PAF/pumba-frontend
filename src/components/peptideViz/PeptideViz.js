import React, {
    PureComponent,
} from 'react'
import PropTypes from 'prop-types'
import { scaleLinear } from 'd3-scale'
import { select, event } from 'd3-selection'
import {axisBottom, axisLeft} from "d3-axis";
import {brush} from "d3-brush";
import * as _ from 'lodash'
import AminoAcidBar from './AminoAcidBar'
import Peptide from './Peptide'
import ProteinVizLegendsContainer from '../legends/ProteinVizLegendsContainer'
import PopOverSkeleton from "../common/popOverSkeleton"
import ProteinTitle from "../common/ProteinTitle"
import { sampleColor } from '../common/colorSettings'

class PeptideViz extends PureComponent {

    constructor(props) {
        super(props)

        this.svg = React.createRef()
        this.brushG = React.createRef()

        const {proteinData, viewWidth, viewHeight, zoom, sequenceData} = this.props

        const minMolWeightDa = Math.pow(10, _.min(_.map(proteinData, function(p){
            return p.theoMergedProtein.theoMolWeights[0]
        })))

        const maxMolWeightDa = Math.pow(10, _.max(_.map(proteinData, function(p){
            const theoMolWeights = p.theoMergedProtein.theoMolWeights
            return theoMolWeights[theoMolWeights.length - 1]
        })))

        this.minMolWeight = Math.log10(minMolWeightDa - 1)
        this.maxMolWeight = Math.log10(maxMolWeightDa + 10)
        this.yRange = this.maxMolWeight - this.minMolWeight

        // just take the theoretical weight of the first protein, it should always be the same.
        const theoMolWeight = Math.log10(proteinData[0].proteins[0].theoMolWeight)

        const zoomLeft = (zoom === undefined) ? 1 : zoom.left;
        const zoomRight = (zoom === undefined) ? sequenceData.length : zoom.right;
        const zoomTop = (zoom === undefined) ? this.minMolWeight : zoom.top
        const zoomBottom = (zoom === undefined) ? this.maxMolWeight : zoom.bottom

        this.state = {
            xScale: scaleLinear().range([0, viewWidth - this.margin.left - this.margin.right]).domain([zoomLeft, zoomRight]),
            yScale: scaleLinear().range([viewHeight - this.margin.top - this.margin.bottom, 0]).domain([zoomTop, zoomBottom]),
            theoMolWeight: theoMolWeight,
            zoomLeft: zoomLeft,
            zoomRight: zoomRight,
            zoomCounter: 0,
            pepCounter: 0
        }
    }

    // set the margins
    margin = {top: 40, right: 10, bottom: 40, left: 40};


    componentDidMount(){
        // add the y-axis
        const yAxis = axisLeft(this.state.yScale)
            .tickValues([1, 1.204119982655925, 1.397940008672038, 1.602059991327962, 1.812913356642856, 2, 2.204119982655925,2.397940008672038,2.602059991327962,2.778151250383644])
            .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

        select(this.yAxis).call(yAxis)

        const xAxis = axisBottom(this.state.xScale)

        select(this.xAxis)
            .call(xAxis)

        const brushSelect = select(this.brushG.current)
        this.setState({brush: brushSelect})
        setTimeout( () => brushSelect.call(brush(this.state.xScale).on('end', this.brushend)) )
    }

    componentDidUpdate(prevProps, prevState){
        const {zoom, sequenceData} = this.props

        // we only update the axis and stuff if the zoom changed
        if(prevState.zoomCounter !== this.state.zoomCounter){
            const zoomLeft = (zoom === undefined) ? 1 : zoom.left;
            const zoomRight = (zoom === undefined) ? sequenceData.length : zoom.right;
            const zoomTop = (zoom === undefined) ? this.minMolWeight : zoom.top
            const zoomBottom = (zoom === undefined) ? this.maxMolWeight : zoom.bottom

            // change the scale after zooming
            this.state.xScale.domain([zoomLeft, zoomRight]);
            this.state.yScale.domain([zoomTop, zoomBottom])

            // update y-axis
            const yAxis = axisLeft(this.state.yScale)
                .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })
            select(this.yAxis).call(yAxis)

            // and x-axis
            const xAxis = axisBottom(this.state.xScale)
            select(this.xAxis)
                .call(xAxis)

            // remember the current zoom state
            this.setState({zoomLeft: zoomLeft, zoomRight: zoomRight, zoomTop: zoomTop, pepCounter: this.state.pepCounter + 1})
        }

    }

    mouseMove = (e) => {
        const {setLegendPos, legendIsMoving} = this.props

        var point = this.svg.current.createSVGPoint()
        point.x = e.clientX
        point.y = e.clientY;
        point = point.matrixTransform(this.svg.current.getScreenCTM().inverse());

        // move the legend
        if(legendIsMoving){
            setLegendPos("peptide", point.x - 8, point.y - 5)
        }

        this.setState({mouseX: point.x, mouseY: point.y})
    }

    getMousePos = () => {
        const {mouseX, mouseY} = this.state
        return [mouseX, mouseY]
    }

    brushend = () => {
        var s = event.selection;
        if(s){
            const xZoom = _.map(s, (a) => {
                return this.state.xScale.invert(a[0])
            });

            const yZoom = _.reverse(_.map(s, (a) => {
                return this.state.yScale.invert(a[1])
            }));

            this.props.changeZoomRangeCB(xZoom[0], xZoom[1], yZoom[0], yZoom[1])

            // change the zoom counter to update Peptides
            this.setState({zoomCounter: this.state.zoomCounter + 1})

            // remove the brush area
            this.state.brush.call(brush().move, null)
        }
    }

    zoomOut = () => {
        this.props.changeZoomRangeCB(undefined, undefined, undefined, undefined)
        // change the zoom counter to update Peptides
        this.setState({zoomCounter: this.state.zoomCounter + 1})
    }

    plotAminoAcidBar = () => {
        const {viewHeight, sequenceData} = this.props
        const {zoomLeft, zoomRight} = this.state

        return <AminoAcidBar
            zoomLeft={zoomLeft}
            zoomRight={zoomRight}
            sequence={sequenceData.sequence}
            xScale={this.state.xScale}
            yPos={viewHeight - this.margin.bottom + 18}
        />
    }

    plotPeptides = () => {
        const {proteinData, clickedSlices, mouseOverSampleId, mouseOverReplId,
            showPopupCB, removePopupCB, datasets, showOnlyRazor, showOnlyUnique, peptideMenuMaxIntensity} = this.props

        const {zoomLeft, zoomRight, zoomTop, pepCounter} = this.state

        // we need this variable to get the correct replIdx
        var replIdx = 0;


        return proteinData.map((sample, i) => {

            // only show active datasets
            if(! datasets[sample.sample].isActive) return null

            return sample.proteins.map((protein, j) => {
                replIdx = replIdx + 1

                const massFits = protein.dataSet.massFitResult.massFits

                const pepWithIdx = _.map(protein.peptides, function(p, i){
                    p.idx = i
                    p.sliceMolWeight = massFits[p.sliceNr-1]
                    return p
                })

                const fltProt = _.filter(pepWithIdx, (pep) => {
                    return pep.endPos > zoomLeft &&
                        pep.startPos < zoomRight &&
                        (! zoomTop || pep.sliceMolWeight >= zoomTop) &&
                        (! showOnlyRazor || pep.isRazor) &&
                        (! showOnlyUnique || pep.uniqueByGroup) &&
                        (! peptideMenuMaxIntensity || pep.intensity >= peptideMenuMaxIntensity)
                })

                const sliceFromReplIsClicked = _.some(clickedSlices, (slice) => {
                    return sample.sample === slice.sample && protein.dataSet.name === slice.replicate
                })

                return fltProt.map((peptide, k) => {
                    // check if given replicate is activated on proteinViz
                    const replIsClicked = _.some(datasets[sample.sample].datasets, (d) => { return d.id === protein.dataSet.id && d.isSelected})

                    const sliceIsClicked = _.some(clickedSlices, (slice) => {
                        return sliceFromReplIsClicked & (slice.idx+1) === peptide.sliceNr
                    })

                    const highlightRepl = (sample.sample === mouseOverSampleId && protein.dataSet.id === mouseOverReplId)

                    return <Peptide
                        xScale={this.state.xScale}
                        yScale={this.state.yScale}
                        replIdx={replIdx-1}
                        sampleName={sample.sample}
                        color={sampleColor(datasets[sample.sample].colorGroup)}
                        replName={protein.dataSet.name}
                        svgParent={this.svg}
                        sliceMolWeight={peptide.sliceMolWeight}
                        pepInfo={peptide}
                        key={i+':'+j+':'+ peptide.idx}
                        highlightRepl={replIsClicked || highlightRepl}
                        sliceIsClicked={sliceIsClicked}
                        showPopupCB={showPopupCB}
                        removePopupCB={removePopupCB}
                        getMousePos={this.getMousePos}
                        pepCounter={pepCounter}
                    />
                })
            })
        })
    }

    plotPopup = () => {
        const {x, y, content} = this.props.popup

        const seqLen = content.Sequence.length
        const height = 115
        const defWidth = 140
        const width = seqLen > 11 ? (seqLen - 11) * 5 + defWidth : defWidth

        return (
            <PopOverSkeleton x={x+5} y={y-height} width={width} height={height} content={content} removable={false} colSpace={70}/>
        )
    }

    plotTheoWeightLine = () => {
        const {yScale, theoMolWeight} = this.state

        const y = yScale(theoMolWeight)

        return <line
            className="theo-weight-line"
            x1={0}
            y1={y}
            x2={this.props.viewWidth}
            y2={ y }
        />
    }

    /**
     * we need to remove the option menu here since the brush stops the bubbling of the click event
     */
    clickBrushRect = () => {
        const {selectedOption, showOptionsMenu} = this.props
        if(selectedOption === 'peptides') showOptionsMenu(undefined)
    }

    render(){
        const {legendPos, viewWidth, viewHeight, mouseLeaveSampleCB, popup, proteinData} = this.props

        // set the initial legend position
        const localLegendPos = (legendPos && legendPos.peptide) ? legendPos.peptide : {x: viewWidth-100, y: 20}

        return <div id={"peptide-plot"}>
            <svg className="peptide-svg"
                 viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                 width="100%"
                 height="100%"
                 ref={this.svg}
                 onMouseMove={(e) => this.mouseMove(e)}
            >
                <g className="pep-y-axis" ref={r => this.yAxis = r}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                <g className="pep-x-axis" ref={r => this.xAxis = r}
                   transform={'translate(' + this.margin.left + ',' + (viewHeight - this.margin.bottom) + ')'}/>
                <g className="brush-g"
                   ref={this.brushG}
                   onDoubleClick={this.zoomOut}
                   onMouseEnter={() => mouseLeaveSampleCB()}
                   onClick={() => this.clickBrushRect()}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                <g className="peptide-viz-g"
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}
                   onDoubleClick={this.zoomOut}
                >
                    { this.plotTheoWeightLine() }
                    <ProteinTitle proteinData={proteinData} y={-10}/>
                    { this.plotAminoAcidBar() }
                    { this.svg && this.plotPeptides() }
                </g>
                <ProteinVizLegendsContainer x={localLegendPos.x} y={localLegendPos.y} width={150} theoMolWeight={this.state.theoMolWeight}>
                </ProteinVizLegendsContainer>
                {popup && this.plotPopup()}
            </svg>
        </div>
    }

}

PeptideViz.propTypes = {
    proteinData: PropTypes.array.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
    zoom: PropTypes.object,
    changeZoomRangeCB: PropTypes.func,
    clickedSlices: PropTypes.array.isRequired,
    sequenceData: PropTypes.object,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    showPopupCB: PropTypes.func.isRequired,
    removePopupCB: PropTypes.func.isRequired,
    popup: PropTypes.object,
    datasets: PropTypes.object.isRequired,
    legendPos: PropTypes.object,
    setLegendPos: PropTypes.func.isRequired,
    legendIsMoving: PropTypes.bool.isRequired,
    datasetChanged: PropTypes.number.isRequired,
    selectedOption: PropTypes.string,
    showOptionsMenu: PropTypes.func.isRequired,
    showOnlyRazor: PropTypes.bool.isRequired,
    showOnlyUnique: PropTypes.bool.isRequired,
    peptideMenuMaxIntensity: PropTypes.number.isRequired,
};

export default (PeptideViz)

