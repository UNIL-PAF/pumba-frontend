import React, {
    PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import LegendField from './LegendField'
import TheoWeightLine from '../proteinViz/TheoWeightLine'
import * as _ from 'lodash';
import { sampleColor } from '../common/colorSettings'

class ProteinVizLegends extends PureComponent {

    // we need the legendIdx to get the right positions of the legends when expanding the replicates
    legendIdx = 1

    componentDidMount(){
        this.legendIdx = 1
    }

    componentDidUpdate(){
        this.legendIdx = 1
    }

    changeSelection(target, sampleName, replIdx){
        const {reloadProtein, setDatasets, datasets} = this.props

        var newDatasets = null

        // set the new dataset
        if(target === "sample"){
            newDatasets = {...datasets, [sampleName]: {
                    isAvailable: datasets[sampleName].isAvailable,
                    datasets: datasets[sampleName].datasets,
                    idx: datasets[sampleName].idx,
                    isActive: ! datasets[sampleName].isActive
                }
            }
        }else{
            let newDatasetsArray = [...(datasets[sampleName].datasets)]
            newDatasetsArray[replIdx].isActive = ! newDatasetsArray[replIdx].isActive

            newDatasets = {...datasets, [sampleName]: {
                    isAvailable: datasets[sampleName].isAvailable,
                    datasets: newDatasetsArray,
                    idx: datasets[sampleName].idx,
                    isActive: datasets[sampleName].isActive
                }
            }
        }

        setDatasets(newDatasets)

        // reload protein with active datasets
        const activeDatasets = _.reduce(newDatasets, (res, val) => {
            if(val.isActive){
                const active = _.filter(val.datasets, (d) => { return d.isActive })
                res = res.concat(_.map(active, 'id'))
            }
            return res
        }, [])

        reloadProtein(activeDatasets.join(','))
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
    sampleSymbol = (x, y, height, replId, mouseOverSampleIdx, sampleName, colorIdx) => {
        const highlight = (sampleName === mouseOverSampleIdx)
        return <circle cx={x} cy={y-height/3} r={(highlight) ? height/4 : height/6} fill={sampleColor(colorIdx)} >
        </circle>
    }

    /**
     *
     */
    replSymbol = (x, y, height, replId, mouseOverReplIdx, sampleName, colorIdx, isSelected) => {
        const highlight = (replId === mouseOverReplIdx)

        return <line
        x1={x}
        y1={y-2}
        x2={x}
        y2={y-height+10}
        stroke={sampleColor(colorIdx)}
        strokeWidth={ (highlight || isSelected) ? 2 : 0.5 }
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
            clickeablePointer={true}
            mouseClickReplCB={mouseClickReplCB}
            removeSelectedReplCB={removeSelectedReplCB}
            onMouseOver={this.mouseOverReplicate}
            mouseOverId={mouseOverReplId}
            sampleName={sampleName}
            replId={repl.id}
            colorIdx={colorIdx}
            isSelected={isSelected}
            x={x+5} y={y+(this.legendIdx)*height} width={width} height={height}
            text={repl.name} legend={this.replSymbol}
            isUnactiveable={true}
            changeSelection={() => this.changeSelection("replicate", sampleName, repl.idx)}
            showCheckbox={isSampleSelected}
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
        const showCheckbox = mouseOverSampleId === sampleName

        const res =  <g key={sampleIdx}>
                <LegendField
                    onMouseOver={this.mouseOverSample}
                    mouseOverId={mouseOverSampleId}
                    sampleName={sampleName}
                    colorIdx={colorIdx}
                    x={x} y={y+(this.legendIdx)*height} width={width} height={height}
                    text={sampleName} legend={this.sampleSymbol}
                    isUnactiveable={true}
                    changeSelection={() => this.changeSelection("sample", sampleName)}
                    showCheckbox={showCheckbox}
                >
                </LegendField>
                { (sampleName === mouseOverSampleId || isSampleSelected) && _.map(sample.datasets, (repl) => this.plotReplicate(repl, x, y, height, sampleIdx, colorIdx, showCheckbox, sampleName)) }
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

    render() {
        const { x, y, width, mouseOverSampleId, clickedRepl, datasets} = this.props;

        // transform the sample into a sorted array
        const samples = _.sortBy(_.values(_.mapValues(datasets, (value, key) => { value.name = key; return value; })), ['idx'])

        const legendHeight = 20
        const selectedSampleIdx = _.countBy(clickedRepl, "sampleIdx")
        const mouseOverReplNr = (mouseOverSampleId !== undefined && (! selectedSampleIdx[mouseOverSampleId])) ? datasets[mouseOverSampleId].datasets.length : 0
        const nrActiveDatasets = _.filter(datasets, (d) => {return d.isAvailable}).length
        const nrLegends = nrActiveDatasets + mouseOverReplNr + _.reduce(selectedSampleIdx, (res, v, k) => {return res + datasets[k].datasets.length}, 0)
        const xShift = 12
        const yShift = 10

        return <g>
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

            { this.plotTheoMolWeight(x + xShift, y+yShift, legendHeight) }

            <g>{_.map(samples, (s) => this.plotSample(s, x+xShift, y+yShift, legendHeight))}</g>
        </g>

    }
}

ProteinVizLegends.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    theoMolWeight: PropTypes.number.isRequired,
    clickedRepl: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    reloadProtein: PropTypes.func.isRequired,
    setDatasets: PropTypes.func.isRequired,
};

export default (ProteinVizLegends);