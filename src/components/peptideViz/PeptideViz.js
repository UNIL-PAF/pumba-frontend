import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import { scaleLinear } from 'd3-scale'
import { select, event, mouse } from 'd3-selection'
import {axisBottom, axisLeft} from "d3-axis";
import {brush} from "d3-brush";
import * as _ from 'lodash'
import AminoAcidBar from './AminoAcidBar'
import Peptide from './Peptide'

class PeptideViz extends Component {

    constructor(props) {
        super(props)

        const {proteinData, viewWidth, viewHeight} = this.props

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

        // get the molWeights for each slice for each sample
        const sliceMolWeight = _.flatMap(proteinData, (oneSample) => {
            return _.map(oneSample.proteins, (protein) => {
                return protein.dataSet.massFitResult.massFits
            })
        })

        this.state = {
            xScale: scaleLinear().range([0, viewWidth - this.margin.left - this.margin.right]),
            yScale: scaleLinear().range([viewHeight - this.margin.top - this.margin.bottom, 0]),
            theoMolWeight: theoMolWeight,
            sliceMolWeight: sliceMolWeight
        }
    }

    // set the margins
    margin = {top: 5, right: 10, bottom: 30, left: 40};


    componentDidMount(){
        // add the y-axis
        const yAxis = axisLeft(this.state.yScale)
            .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

        select(this.yAxis).call(yAxis)

        const xAxis = axisBottom(this.state.xScale)

        select(this.xAxis)
            .call(xAxis)

        setTimeout( () => this.brushG.call(brush(this.state.xScale, this.state.yScale).on('end', this.brushend)) )

        // we have to update after the "this.svg" has been set
        this.forceUpdate()
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

            // remove the brush area
            this.brushG.call(brush().move, null)
        }
    }

    zoomOut = () => {
        this.props.changeZoomRangeCB(undefined, undefined, undefined, undefined)
    }

    plotAminAcidBar = (thisZoomLeft, thisZoomRight) => {
        const {viewHeight, sequenceData} = this.props

        return <AminoAcidBar
            zoomLeft={thisZoomLeft}
            zoomRight={thisZoomRight}
            sequence={sequenceData.sequence}
            xScale={this.state.xScale}
            yPos={viewHeight - this.margin.bottom + 18}
        />
    }

    plotPeptides = (thisZoomLeft, thisZoomRight, yZoomFactor) => {
        const {proteinData, clickedRepl} = this.props

        // we need this variable to get the correct replIdx
        var replIdx = 0;

        return proteinData.map((sample, i) => {
            return sample.proteins.map((protein, j) => {
                replIdx = replIdx + 1

                const fltProt = _.filter(protein.peptides, (pep) => {
                    return pep.endPos > thisZoomLeft && pep.startPos < thisZoomRight
                })

                return fltProt.map((peptide, k) => {

                    // check if given replicate is activated on proteinViz
                    const replIsClicked = _.some(clickedRepl, (x) => {
                        return x.sampleIdx === i && x.replIdx === j
                    })

                    return <Peptide
                        xScale={this.state.xScale}
                        yScale={this.state.yScale}
                        sampleIdx={i}
                        replIdx={replIdx-1}
                        svgParent={this.svg}
                        sliceMolWeight={this.state.sliceMolWeight}
                        pepInfo={peptide}
                        yZoomFactor={yZoomFactor}
                        key={i+':'+j+':'+k}
                        replIsClicked={replIsClicked}
                    />
                })
            })
        })
    }


    render(){
        const {viewWidth, viewHeight, zoom, sequenceData} = this.props

        const thisZoomLeft = (zoom === undefined) ? 1 : zoom.left;
        const thisZoomRight = (zoom === undefined) ? sequenceData.length : zoom.right;
        const thisZoomTop = (zoom === undefined) ? this.maxMolWeight : zoom.top
        const thisZoomBottom = (zoom === undefined) ? this.minMolWeight : zoom.bottom

        // change the scale after zooming
        this.state.xScale.domain([thisZoomLeft, thisZoomRight])
        this.state.yScale.domain([thisZoomTop, thisZoomBottom])

        // compute the current factor of yZoom
        const yZoomFactor = this.yRange / (thisZoomTop - thisZoomBottom)

        console.log(this.yRange, thisZoomTop, thisZoomBottom, yZoomFactor)

        return <div>
            <svg className="merged-2d-svg"
                 viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                 width="100%"
                 height="100%"
                 ref={r => this.svg = r}
            >
                <g className="pep-y-axis" ref={r => this.yAxis = r}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                <g className="pep-x-axis" ref={r => this.xAxis = r}
                   transform={'translate(' + this.margin.left + ',' + (viewHeight - this.margin.bottom) + ')'}/>
                <g className="brush-g" ref={r => this.brushG = select(r)} onDoubleClick={this.zoomOut}
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                <g className="peptide-viz-g"
                   transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}
                   onDoubleClick={this.zoomOut}
                >
                    { this.plotAminAcidBar(thisZoomLeft, thisZoomRight) }
                    { this.svg && this.plotPeptides(thisZoomLeft, thisZoomRight, yZoomFactor) }
                </g>
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
    clickedRepl: PropTypes.array.isRequired,
};

export default (PeptideViz)

