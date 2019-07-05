import React, {
    PureComponent,
} from 'react';
import { mouse } from 'd3-selection'
import PropTypes from 'prop-types';
import LegendField from './LegendField'
import TheoWeightLine from '../proteinViz/TheoWeightLine'
import * as _ from 'lodash';
import { sampleColor } from '../common/colorSettings'

class ProteinVizLegends extends PureComponent {

    constructor(props) {
        super(props);

        this.state = { mouseOverLegend: false }
    }

    // we need the legendIdx to get the right positions of the legends when expanding the replicates
    legendIdx = 1

    componentDidMount(){
        this.legendIdx = 1
    }

    componentDidUpdate(){
        this.legendIdx = 1
    }

    changeSelection(target, sampleName, replIdx){
        const {reloadProteinCB, setDatasets, datasets} = this.props

        var newDatasets = null

        // set the new dataset
        if(target === "sample"){
            newDatasets = {...datasets, [sampleName]: {
                    isAvailable: datasets[sampleName].isAvailable,
                    datasets: datasets[sampleName].datasets,
                    idx: datasets[sampleName].idx,
                    isActive: ! datasets[sampleName].isActive,
                    isChecked: ! datasets[sampleName].isActive
                }
            }
        }else{
            let newDatasetsArray = [...(datasets[sampleName].datasets)]
            newDatasetsArray[replIdx].isActive = ! newDatasetsArray[replIdx].isActive

            newDatasets = {...datasets, [sampleName]: {
                    isAvailable: datasets[sampleName].isAvailable,
                    datasets: newDatasetsArray,
                    idx: datasets[sampleName].idx,
                    isActive: datasets[sampleName].isActive,
                    isChecked: datasets[sampleName].isChecked,
                }
            }
        }

        // reload protein with active datasets
        const activeDatasets = _.reduce(newDatasets, (res, val) => {
            if(val.isActive){
                const active = _.filter(val.datasets, (d) => { return d.isActive })
                res = res.concat(_.map(active, 'id'))
            }
            return res
        }, [])

        const callOnComplete = () => {setDatasets(newDatasets)}

        reloadProteinCB(activeDatasets.join(','), callOnComplete)
    }


    /**
     * plot the symbol for the theo weight line
     */
    theoMolSymbol = (x, y, height) => {
        return <TheoWeightLine xPos={x} yTop={y-1} height={height+10}>
        </TheoWeightLine>
    }

    /**
     * plot the sample dots
     */
    sampleSymbol = (x, y, height, settings) => {
        const highlight = (settings.sampleName === settings.mouseOverId)
        const fillColor = settings.isActive ? sampleColor(settings.colorIdx) : "None"
        const strokeColor = sampleColor(settings.colorIdx)

        return <circle cx={x} cy={y-height/3} r={(highlight) ? height/4 : height/6} fill={fillColor} stroke={strokeColor}>
        </circle>
    }

    /**
     *
     */
    replSymbol = (x, y, height, settings) => {
        const highlight = (settings.replId === settings.mouseOverId)

        return <line
        x1={x}
        y1={y-2}
        x2={x}
        y2={y-height+10}
        stroke={sampleColor(settings.colorIdx)}
        strokeWidth={ (highlight || settings.isSelected) ? 2 : 0.5 }
        />
    }

    mouseOverReplicate = (sampleIdx, replIdx) => {
        const {mouseOverReplCB} = this.props

        this.mouseOverSample(sampleIdx)
        mouseOverReplCB(replIdx)
    }

    plotReplicate = (repl, x, y, height, sampleIdx, colorIdx, isSampleSelected, sampleName) => {
        this.legendIdx = this.legendIdx + 1
        const {mouseOverReplId, width, mouseClickReplCB, clickedRepl, removeSelectedReplCB} = this.props

        // check if it is selected
        const isSelected = _.some(clickedRepl, (x) => {return x.sampleIdx === sampleName && x.replIdx === repl.id})

       const res = <LegendField
            key={repl.idx}
            clickeablePointer={repl.isActive ? true : false}
            mouseClickReplCB={mouseClickReplCB}
            removeSelectedReplCB={removeSelectedReplCB}
            onMouseOver={repl.isActive ? this.mouseOverReplicate : undefined}
            mouseOverId={mouseOverReplId}
            sampleName={sampleName}
            replId={repl.id}
            colorIdx={colorIdx}
            isSelected={isSelected}
            x={x+5} y={y+(this.legendIdx)*height} width={width} height={height}
            text={repl.name} legend={this.replSymbol}
            textColor={repl.isActive ? "black" : "silver"}
            isUnactiveable={true}
            changeSelection={() => this.changeSelection("replicate", sampleName, repl.idx)}
            showCheckbox={isSampleSelected}
            isActive={repl.isActive}
       >
        </LegendField>

        return res
    }

    mouseOverSample = (sampleId) => {
        this.props.mouseLeaveReplCB()
        this.props.mouseOverSampleCB(sampleId)
    }

    plotSample = (sample, x, y, height) => {
        const {width, mouseOverSampleId, clickedRepl, datasets} = this.props
        const sampleIdx = sample.idx
        const sampleName = sample.name

        // don't show anything in case this is an unavailable dataset
        if(! datasets[sampleName].isAvailable) return null

        const isSampleSelected = _.some(clickedRepl, (x) => {return x.sampleIdx === sampleName})
        const colorIdx = datasets[sampleName].idx
        const isActive = datasets[sampleName].isActive
        const showCheckbox = mouseOverSampleId === sampleName

        // in case the sample is not active and we're not on the legend, we're not showing anything
        if(! isActive && ! this.state.mouseOverLegend) return null

        const res =  <g key={sampleIdx}>
                <LegendField
                    onMouseOver={this.mouseOverSample}
                    mouseOverId={mouseOverSampleId}
                    mouseOverLegend={this.state.mouseOverLegend}
                    sampleName={sampleName}
                    colorIdx={colorIdx}
                    x={x} y={y+(this.legendIdx)*height} width={width} height={height}
                    text={sampleName} legend={this.sampleSymbol}
                    textColor={isActive ? "black" : "silver"}
                    isUnactiveable={true}
                    changeSelection={() => this.changeSelection("sample", sampleName)}
                    showCheckbox={showCheckbox}
                    isActive={isActive}
                >
                </LegendField>
                { ((this.state.mouseOverLegend || isSampleSelected) && isActive && _.map(sample.datasets, (repl) => this.plotReplicate(repl, x, y, height, sampleIdx, colorIdx, showCheckbox, sampleName))) }
        </g>

        this.legendIdx = this.legendIdx + 1

        return res
    }

    plotTheoMolWeight = (x, y, legendHeight) => {
        const {width, mouseLeaveSampleCB, theoMolWeight} = this.props

        return  <LegendField
            x={x} y={y} width={width} height={legendHeight}
            onMouseOver={mouseLeaveSampleCB}
            text={"Theo Mol Weight (" + Math.pow(10, theoMolWeight).toFixed(2) + " kDa)"}
            legend={this.theoMolSymbol}
            isUnactiveable={false}
        >
        </LegendField>
    }

    onMouseEnter = () => {
        this.setState({mouseOverLegend: true})
    }

    onMouseLeave = () => {
        this.setState({mouseOverLegend: false})
    }

    startMoving = () => {
        console.log("startMoving")
    }

    moveLegend = (e) => {
        console.log("moveLegend", e.clientX, e.clientY)
    }

    stopMoving = () => {
        console.log("stopMoving")
    }


    render() {
        const { x, y, width, clickedRepl, datasets} = this.props;

        // transform the sample into a sorted array
        const samples = _.sortBy(_.values(_.mapValues(datasets, (value, key) => { value.name = key; return value; })), ['idx'])

        const legendHeight = 20
        const selectedSampleIdx = _.countBy(clickedRepl, "sampleIdx")
        const nrRep = (this.state.mouseOverLegend ? _.sum(_.map(datasets, (d) => { return d.isActive && d.datasets.length})) : 0)
        const nrActiveDatasets = _.filter(datasets, (d) => {return d.isAvailable && (d.isActive || this.state.mouseOverLegend)}).length
        const selectedReplNr = (! this.state.mouseOverLegend ? _.reduce(selectedSampleIdx, (res, v, k) => {return res + (datasets[k].isActive ? datasets[k].datasets.length : 0)}, 0) : 0)

        const nrLegends = nrActiveDatasets + nrRep + selectedReplNr
        const xShift = 12
        const yShift = 10

        return <g onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <rect
                className="merged-legends-box"
                x={x}
                y={y}
                rx={5}
                ry={5}
                width={width + 20}
                height={nrLegends * legendHeight + 40}
                fill={"white"}
                stroke={"grey"}
                strokeWidth={1}
            />

            <rect
                x={x}
                y={y}
                width={10}
                height={10}
                fill={"green"}
                onMouseDown={this.startMoving}
                onMouseMove={this.moveLegend}
                onMouseUp={this.stopMoving}
            />

            { this.plotTheoMolWeight(x + xShift, y+yShift, legendHeight) }

            <g>{_.map(samples, (s) => this.plotSample(s, x+xShift, y+yShift, legendHeight))}</g>
        </g>

    }
}

ProteinVizLegends.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    theoMolWeight: PropTypes.number.isRequired,
    mouseOverReplId: PropTypes.string,
    mouseOverSampleId: PropTypes.string,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    clickedRepl: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    reloadProteinCB: PropTypes.func.isRequired,
    setDatasets: PropTypes.func.isRequired,
};

export default (ProteinVizLegends);