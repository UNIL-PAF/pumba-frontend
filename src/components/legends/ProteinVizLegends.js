import React, {
    PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import LegendField from './LegendField'
import * as _ from 'lodash';
import { sampleColor } from '../common/colorSettings'
import MoveButton from "../common/MoveButton";

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

        // set the new dataset
        if(target === "sample"){
            setDatasets({...datasets, [sampleName]: {
                    isAvailable: datasets[sampleName].isAvailable,
                    datasets: datasets[sampleName].datasets,
                    idx: datasets[sampleName].idx,
                    isActive: ! datasets[sampleName].isActive,
                    isChecked: datasets[sampleName].isChecked,
                    colorGroup: datasets[sampleName].colorGroup,
                    organism: datasets[sampleName].organism
                }})
        }else{
            let newDatasetsArray = [...(datasets[sampleName].datasets)]
            newDatasetsArray[replIdx].isActive = ! newDatasetsArray[replIdx].isActive

            const newDatasets = {...datasets, [sampleName]: {
                    isAvailable: datasets[sampleName].isAvailable,
                    datasets: newDatasetsArray,
                    idx: datasets[sampleName].idx,
                    isActive: datasets[sampleName].isActive,
                    isChecked: datasets[sampleName].isChecked,
                    colorGroup: datasets[sampleName].colorGroup,
                    organism: datasets[sampleName].organism
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
            reloadProteinCB(activeDatasets.join(","), callOnComplete)
        }
    }

    /**
     * plot the symbol for the theo weight line
     */
    theoMolSymbol = (x, y, height) => {
        const yMargins = 5
        const yShift = 3

        return <line
            className="theo-weight-line"
            x1={x}
            y1={y - yMargins + yShift}
            x2={x}
            y2={ y - height  + yMargins + yShift}
        />
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
        const {mouseOverReplId, width, mouseClickReplCB, datasets} = this.props

        // check if it is selected
        const isSelected = (_.find(datasets[sampleName].datasets, (x) => {return x.id === repl.id})).isSelected

       const res = <LegendField
            key={repl.idx}
            clickeablePointer={repl.isActive ? true : false}
            mouseClickReplCB={mouseClickReplCB}
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
        const {width, mouseOverSampleId, datasets} = this.props
        const sampleIdx = sample.idx
        const sampleName = sample.name

        // don't show anything in case this is an unavailable dataset
        if(! datasets[sampleName].isAvailable) return null

        const isSampleSelected = _.some(datasets[sampleName].datasets, (x) => {return x.isSelected})
        const colorIdx = datasets[sampleName].colorGroup
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
        this.props.mouseLeaveReplCB()
        this.props.mouseLeaveSampleCB()
    }

    startMoving = (e) => {
        const {setMoveLegend} = this.props
        setMoveLegend(true)
    }

    stopMoving = () => {
        const {setMoveLegend} = this.props
        setMoveLegend(false)
    }

    render() {
        const { x, y, width, datasets, legendIsMoving} = this.props;
        const {mouseOverLegend} = this.state

        // transform the sample into a sorted array
        const samples = _.sortBy(_.values(_.mapValues(datasets, (value, key) => { value.name = key; return value; })), ['idx'])

        const legendHeight = 20
        const nrRep = (mouseOverLegend ? _.sum(_.map(datasets, (d) => { return d.isActive && d.datasets.length})) : 0)
        const nrActiveDatasets = _.filter(datasets, (d) => {return d.isAvailable && (d.isActive || mouseOverLegend)}).length
        const selectedReplNr = (! mouseOverLegend ? _.reduce(datasets, (res, v, k) => {return res + (datasets[k].isActive ? (_.some(datasets[k].datasets, 'isSelected') ? datasets[k].datasets.length : 0) : 0)}, 0) : 0)

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

            {mouseOverLegend && <MoveButton x={x + 2} y={y + 2} onMouseDown={this.startMoving} onMouseUp={this.stopMoving} legendIsMoving={legendIsMoving}></MoveButton>}

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
    datasets: PropTypes.object.isRequired,
    reloadProteinCB: PropTypes.func.isRequired,
    setDatasets: PropTypes.func.isRequired,
    legendIsMoving: PropTypes.bool.isRequired,
    setMoveLegend: PropTypes.func.isRequired,
    datasetChanged: PropTypes.number.isRequired,
};

export default (ProteinVizLegends);