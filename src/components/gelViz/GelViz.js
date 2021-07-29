import React, {
    PureComponent
} from 'react'
import PropTypes from 'prop-types'
import GelSlice from "./GelSlice"
import * as _ from 'lodash';
import {scaleLinear} from "d3-scale";
import {axisLeft} from "d3-axis";
import {select} from "d3-selection";
import {interpolateHsl} from "d3-interpolate";
import { sampleColor } from '../common/colorSettings'
import ExpandCollapsInfo from "./ExpandCollapsInfo";
import ProteinTitle from "../common/ProteinTitle"
import ExportSvgButton from "../common/ExportSvgButton"
import {Button} from "reactstrap";
import GelHelpModal from './GelHelpModal';
import GelOptions from "../options/GelOptions";
import { GearFill, InfoCircleFill } from "react-bootstrap-icons";

class GelViz extends PureComponent {
  // set the margins
  margin = { top: 80, right: 10, bottom: 40, left: 60 };
  sliceWidth = 40;
  sliceSpacing = 10;

  // grey scale
  greyScale = interpolateHsl("#FAFAFA", "#444444");

  constructor(props) {
    super(props);

    const { proteinData, viewHeight } = this.props;

    this.yAxis = React.createRef();
    this.svg = React.createRef();

    const minMolWeightDa = Math.pow(
      10,
      _.min(
        _.map(proteinData, function (p) {
          return p.theoMergedProtein.theoMolWeights[0];
        })
      )
    );

    const maxMolWeightDa = Math.pow(
      10,
      _.max(
        _.map(proteinData, function (p) {
          const theoMolWeights = p.theoMergedProtein.theoMolWeights;
          return theoMolWeights[theoMolWeights.length - 1];
        })
      )
    );

    const minMolWeight = Math.log10(minMolWeightDa - 1);
    const maxMolWeight = Math.log10(maxMolWeightDa + 10);

    this.yScale = scaleLinear()
      .range([viewHeight - this.margin.top - this.margin.bottom, 0])
      .domain([minMolWeight, maxMolWeight]);

    this.computeMolWeights();

    this.state = {
      proteinDataTimestamp: proteinData.timestamp,
      maxInt: this.getMaxInt(),
      modal: false,
      optionsMenu: false
    };
  }

  componentDidMount() {
    // add the y-axis
    const yAxis = axisLeft(this.yScale)
      .tickValues([
        1, 1.204119982655925, 1.397940008672038, 1.602059991327962,
        1.812913356642856, 2, 2.204119982655925, 2.397940008672038,
        2.602059991327962, 2.778151250383644,
      ])
      .tickFormat((d) => {
        return Math.round(Math.pow(10, d)) + " kDa";
      });

    const yAxisSelect = select(this.yAxis.current);
    yAxisSelect.call(yAxis);
  }

  componentDidUpdate() {
    const { proteinData } = this.props;

    if (
      this.state.proteinDataTimestamp &&
      this.state.proteinDataTimestamp !== proteinData.timestamp
    ) {
      this.setState({ maxInt: this.getMaxInt() });
      this.computeMolWeights();
    }
  }

  computeMolWeights = () => {
    const { isoforms, sequenceData } = this.props;

    // just take the theoretical weight of the first protein, it should always be the same.
    this.theoMolWeight = sequenceData.molWeight / 1000;
    this.theoMolWeightPos =
      this.yScale(Math.log10(this.theoMolWeight)) + this.margin.top;

    const sortedIsoforms = _.sortBy(isoforms, "molWeight");
    const corrMolWeight = this.theoMolWeight * 1000;
    const splitPos = _.findIndex(sortedIsoforms, (s) => {
      return s.molWeight >= corrMolWeight;
    });

    const upperPart = splitPos > -1 ? sortedIsoforms.slice(splitPos) : [];
    let lowerPart =
      splitPos > 0 ? sortedIsoforms.slice(0, splitPos - 1).reverse() : [];
    if (splitPos === -1) {
      lowerPart = sortedIsoforms.reverse();
    }

    const computeLabelPos = (isoformPart, isLowerPart) => {
      let lastPos = this.theoMolWeightPos;
      let posCorr = 0;

      return _.map(isoformPart, (iso) => {
        const molWeight = iso.molWeight / 1000;
        const yPos = this.yScale(Math.log10(molWeight)) + this.margin.top;

        let labelPos = yPos;

        if (isLowerPart ? yPos - lastPos < 10 : lastPos - yPos < 10) {
          posCorr += 10;
          labelPos = yPos + (isLowerPart ? 1 : -1) * posCorr;
        }

        lastPos = labelPos;

        return {
          yPos: yPos,
          labelPos: labelPos,
          name:
            iso.proteinId +
            "-" +
            iso.isoformId +
            " (" +
            molWeight.toFixed(2) +
            " kDa)",
        };
      });
    };

    this.isoformInfo = computeLabelPos(lowerPart, true).concat(
      computeLabelPos(upperPart, false)
    );
  };

  getMaxInt = () => {
    return _.max(
      _.map(this.props.proteinData, function (pd) {
        return _.max(
          _.map(pd.proteins, function (p) {
            return _.max(p.intensities);
          })
        );
      })
    );
  };

  onMouseEnterMerged = (sampleId) => {
    this.setState({ mouseEnteredSample: sampleId });
    this.mouseEnter();
  };

  onMouseLeaveMerged = () => {
    this.setState({ mouseEnteredSample: undefined });
    this.mouseLeave();
  };

  mouseMove = (e) => {
    var point = this.svg.current.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.svg.current.getScreenCTM().inverse());

    const x = point.x - this.margin.left;
    const y = point.y - this.margin.top;

    this.setState({ mouseX: x, mouseY: y });
  };

  getMousePos = () => {
    const { mouseX, mouseY } = this.state;
    return [mouseX, mouseY];
  };

  mouseEnter = () => {
    this.setState({ mouseHere: true });
  };

  mouseLeave = () => {
    this.setState({ mouseHere: false });
  };

  plotMergedGel = (
    thisProteinData,
    title,
    slicePos,
    sampleName,
    containsSelected
  ) => {
    const { viewHeight, mouseClickSampleCB, gelContrast } = this.props;

    return (
      <g>
        <GelSlice
          key={"gel-slice-" + title}
          title={title}
          subTitle={"Merged"}
          sliceWidth={this.sliceWidth}
          sliceHeight={viewHeight - this.margin.top - this.margin.bottom}
          xPos={
            slicePos * (this.sliceWidth + this.sliceSpacing) +
            this.margin.left +
            10
          }
          yPos={this.margin.top}
          yScale={this.yScale}
          maxInt={this.state.maxInt}
          mergedData={thisProteinData.shortMergedData}
          amplify={gelContrast}
          greyScale={this.greyScale}
          mouseClickCB={mouseClickSampleCB}
          sampleName={sampleName}
          onMouseEnterCB={this.onMouseEnterMerged}
          onMouseLeaveCB={this.onMouseLeaveMerged}
        ></GelSlice>
        {this.state.mouseEnteredSample === sampleName &&
          this.plotExpandInfo(
            thisProteinData,
            title,
            slicePos,
            sampleName,
            containsSelected
          )}
      </g>
    );
  };

  plotOrigGels = (datasets, thisProteinData, slicePos, sampleName) => {
    const { viewHeight, mouseClickReplCB, gelContrast } = this.props;

    let localPos = 0;

    return _.map(datasets, (dataset, k) => {
      if (!dataset.isSelected || !dataset.isAvailable) {
        return null;
      }

      const gelPlot = (
        <GelSlice
          key={"gel-slice-" + dataset.name}
          title={""}
          subTitle={dataset.name}
          sliceWidth={this.sliceWidth}
          sliceHeight={viewHeight - this.margin.top - this.margin.bottom}
          xPos={
            (slicePos + localPos) * (this.sliceWidth + this.sliceSpacing) +
            this.margin.left +
            10
          }
          yPos={this.margin.top}
          yScale={this.yScale}
          maxInt={this.state.maxInt}
          datasetData={thisProteinData.proteins}
          amplify={gelContrast}
          greyScale={this.greyScale}
          mouseClickReplCB={mouseClickReplCB}
          sampleName={sampleName}
          replId={dataset.id}
          onMouseEnterCB={this.mouseEnter}
          onMouseLeaveCB={this.mouseLeave}
        ></GelSlice>
      );

      localPos += 1;
      return gelPlot;
    });
  };

  plotSampleRect = (slicePos, nrSelectedDatasets, datasetId) => {
    const { viewHeight } = this.props;

    const sliceSize = this.sliceWidth + this.sliceSpacing;
    return (
      <rect
        x={slicePos * sliceSize + this.margin.left + 6}
        y={this.margin.top}
        rx={3}
        ry={3}
        width={(1 + nrSelectedDatasets) * sliceSize - 2}
        height={viewHeight - this.margin.top - this.margin.bottom}
        fill={"none"}
        stroke={sampleColor(datasetId)}
      ></rect>
    );
  };

  plotExpandInfo = (
    thisProteinData,
    title,
    slicePos,
    sampleName,
    containsSelected
  ) => {
    const { viewHeight } = this.props;

    return (
      <ExpandCollapsInfo
        xPos={
          slicePos * (this.sliceWidth + this.sliceSpacing) +
          this.margin.left +
          10
        }
        yPos={viewHeight - this.margin.bottom + 10}
        showExpand={!containsSelected}
      />
    );
  };

  plotGels = () => {
    const { datasets, proteinData } = this.props;
    const activeDatasets = _.filter(datasets, "isActive");
    let slicePos = 0;

    return _.map(activeDatasets, (dataset) => {
      const thisProteinData = _.find(proteinData, (p) => {
        return p.sample === dataset.name;
      });

      // return null if there is no data
      if (!thisProteinData) return null;

      const nrSelectedDatasets = _.reduce(
        dataset.datasets,
        (acc2, d2) => {
          const selData = _.find(thisProteinData.proteins, (p) => {
            return p.dataSet.id === d2.id;
          });
          return (
            (d2.isSelected && d2.isSelected["gel"] && selData ? 1 : 0) + acc2
          );
        },
        0
      );

      const plots = (
        <g key={"slice-group-" + dataset.name}>
          {this.plotMergedGel(
            thisProteinData,
            dataset.name,
            slicePos,
            dataset.name,
            nrSelectedDatasets > 0
          )}
          {nrSelectedDatasets &&
            this.plotOrigGels(
              dataset.datasets,
              thisProteinData,
              slicePos + 1,
              dataset.name
            )}
          {nrSelectedDatasets &&
            this.plotSampleRect(
              slicePos,
              nrSelectedDatasets,
              dataset.colorGroup
            )}
        </g>
      );

      slicePos += 1 + nrSelectedDatasets;
      return plots;
    });
  };

  plotTheoMolWeight = (xPos) => {
    return (
      <g>
        <line
          className={"theo-line-gel"}
          x1={this.margin.left}
          y1={this.theoMolWeightPos}
          x2={xPos}
          y2={this.theoMolWeightPos}
        ></line>
        <text
          className={"gel-theo-molweight-text"}
          x={xPos + 4}
          y={this.theoMolWeightPos + 3}
        >
          {this.theoMolWeight.toFixed(2) + " kDa"}
        </text>
      </g>
    );
  };

  plotIsoforms = (xPos) => {
    return (
      <g>
        {_.map(this.isoformInfo, (iso, i) => {
          return (
            <g key={"isoform-" + i}>
              <line
                className={"isoform-line-gel"}
                x1={this.margin.left}
                y1={iso.yPos}
                x2={xPos - 10}
                y2={iso.yPos}
              ></line>
              <line
                className={"isoform-label-line-gel"}
                x1={xPos - 10}
                y1={iso.yPos}
                x2={xPos}
                y2={iso.labelPos}
              ></line>
              <text
                className={"isoform-text"}
                x={xPos + 4}
                y={iso.labelPos + 3}
              >
                {iso.name}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  plotMousePositionLine = (mouseWeightPos, totalSlicesWidth) => {
    const { mouseY } = this.state;
    const rectWidth = 49;
    const rectHeight = 20;

    if (mouseY) {
      return (
        <g>
          <line
            className={"gel-mouse-pos-line"}
            x1={this.margin.left}
            y1={mouseY + this.margin.top}
            x2={totalSlicesWidth + this.margin.left}
            y2={mouseY + this.margin.top}
          ></line>
          <rect
            x={11}
            y={mouseY + this.margin.top - rectHeight / 2}
            width={rectWidth}
            height={rectHeight}
            fill={"white"}
            stroke={"grey"}
            strokeWidth={1}
            rx={3}
            ry={3}
          ></rect>
          <text
            className={"unselecteable"}
            x={20}
            y={mouseY + this.margin.top + 2}
            fontSize={"50%"}
            fontFamily={"sans-serif"}
          >
            {Math.round(Math.pow(10, mouseWeightPos)) + " kDa"}
          </text>
        </g>
      );
    }
  };

  toggleHelp = () => {
    this.setState({modal: ! this.state.modal})
  };

  render() {
    const { viewWidth, viewHeight, datasets, sequenceData, showIsoforms } =
      this.props;
    const { mouseY, mouseHere } = this.state;

    const nrSlices = _.reduce(
      datasets,
      (acc, d) => {
        const selectedDatasets =
          d.isAvailable && d.isActive
            ? _.reduce(
                d.datasets,
                (acc2, d2) => {
                  return (
                    (d2.isAvailable && d2.isSelected && d2.isSelected.gel
                      ? 1
                      : 0) + acc2
                  );
                },
                1
              )
            : 0;
        return acc + selectedDatasets;
      },
      0
    );

    const totalSlicesWidth = nrSlices * (this.sliceWidth + this.sliceSpacing);
    const theoMolWeightPosX = totalSlicesWidth + this.margin.left + 15;

    // the mol weight at the mouse position
    const mouseWeightPos = this.yScale.invert(mouseY);

    const { modal, optionsMenu } = this.state;

    return (
      <div id={"gel-plot"}>
        <div id={"gel-option-group"}>
          <Button
            active={optionsMenu}
            color="primary"
            onClick={() => this.setState({ optionsMenu: !optionsMenu })}
          >
            <span>
              <GearFill />
            </span>
            &nbsp; Options
          </Button>
          &nbsp;
          {optionsMenu && <GelOptions></GelOptions>}
          <ExportSvgButton
            svg={this.svg}
            fileName={sequenceData.proteinId + "-lanes"}
          ></ExportSvgButton>
          &nbsp;
          <Button color="primary" onClick={() => this.toggleHelp()}>
              <span><InfoCircleFill/></span>
              &nbsp;
            Help
          </Button>
          <GelHelpModal toggle={this.toggleHelp} modal={modal}></GelHelpModal>
        </div>
        <svg
          className="gel-svg"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="xMinYMin"
          width="100%"
          height="100%"
          ref={this.svg}
          onMouseMove={(e) => this.mouseMove(e)}
        >
          <g
            className="gel-y-axis"
            ref={this.yAxis}
            transform={
              "translate(" + this.margin.left + "," + this.margin.top + ")"
            }
          />
          {this.plotGels()}
          {showIsoforms && this.plotIsoforms(theoMolWeightPosX)}
          {this.plotTheoMolWeight(theoMolWeightPosX)}
          {mouseHere &&
            this.plotMousePositionLine(mouseWeightPos, totalSlicesWidth)}
          <ProteinTitle sequenceData={sequenceData} x={100} y={20} />
        </svg>
      </div>
    );
  }
}

GelViz.propTypes = {
    proteinData: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    viewWidth: PropTypes.number.isRequired,
    viewHeight: PropTypes.number.isRequired,
    mouseClickSampleCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    gelContrast: PropTypes.number.isRequired,
    isoforms: PropTypes.array,
    sequenceData: PropTypes.object,
    showIsoforms: PropTypes.bool.isRequired
};

export default GelViz