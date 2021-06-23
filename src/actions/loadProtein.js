import fetch from "cross-fetch";
import pumbaConfig from "../config";
import { resetSampleSelection } from "./sampleSelection";
import {
  resetProteinView,
  computeTheoMergedProteins,
} from "./proteinVizActions";
import { resetPeptideView } from "./peptideVizActions";
import {
  setGelContrast,
  setProteinMenuMaxIntensity,
  setPeptideMenuMaxIntensity,
  setShowOnlyRazor,
  setShowOnlyUnique,
} from "./menuActions";
import * as _ from "lodash";

export const PROTEIN_IS_LOADED = "PROTEIN_IS_LOADED";
export const REQUEST_PROTEIN = "REQUEST_PROTEIN";
export const ADD_PROTEIN_DATA = "ADD_PROTEIN_DATA";
export const PROTEIN_LOAD_ERROR = "PROTEIN_LOAD_ERROR";
export const GOTO_VIZ = "GOTO_VIZ";
export const ADD_SEQUENCE_DATA = "ADD_SEQUENCE_DATA";
export const SET_DATASETS = "SET_DATASETS";
export const SET_SORTED_DATASET_NAMES = "SET_SORTED_DATASET_NAMES";
export const SELECT_DATASET = "SELECT_DATASET";
export const SELECT_ALL_DATASETS = "SELECT_ALL_DATASETS";
export const SET_PROTEIN_MAX_INTENSITY = "SET_PROTEIN_MAX_INTENSITY";
export const SET_PEPTIDE_MAX_INTENSITY = "SET_PEPTIDE_MAX_INTENSITY";
export const SET_PEPTIDE_MIN_INTENSITY = "SET_PEPTIDE_MIN_INTENSITY";
export const ADD_ISOFORMS = "ADD_ISOFORMS";
export const SET_SUGGESTIONS = "SET_SUGGESTIONS";

export function reloadProtein(activeDatasetIds, callOnComplete) {
  return function (dispatch, getState) {
    const proteinId = getState().loadProtein.proteinData[0].mainProteinId;
    dispatch(fetchProtein(proteinId, activeDatasetIds, true, callOnComplete));
  };
}

function addShortMergedData(json) {
  _.map(json, (d) => {
    const molWeights = d.theoMergedProtein.theoMolWeights;
    const intensities = d.theoMergedProtein.intensities;
    const winSize = 10;
    const wins = _.range(0, molWeights.length - 1, winSize);

    const mergedMolWeights = _.map(wins, (w) => {
      return (
        _.reduce(molWeights.slice(w, w + winSize), (v, a) => v + a, 0) / winSize
      );
    });
    const mergedIntensities = _.map(wins, (w) => {
      return (
        _.reduce(intensities.slice(w, w + winSize), (v, a) => v + a, 0) /
        winSize
      );
    });
    d.shortMergedData = {
      molWeights: mergedMolWeights,
      intensities: mergedIntensities,
    };
  });
}

function inactivateMissingDatasets(origDatasets, proteinMerges){
  const availableSamples = _.map(proteinMerges, "sample")

  const newDatasets = _.mapValues(origDatasets, (v) => {
    if(! availableSamples.includes(v.name)){
      v.isAvailable = false
      v.isActive = false
    }
    return v
  });

  return newDatasets
}

export function fetchProtein(proteinId, datasetIds, noReset, callOnComplete) {
  return function (dispatch, getState) {
    dispatch(requestProtein(proteinId));

    // we reset the error message to undefined
    dispatch(proteinLoadError(undefined));

    if (!noReset) {
      // and reset settings from the views
      dispatch(resetProteinView());
      dispatch(resetPeptideView());
      dispatch(resetSampleSelection());
    }

    const organism = getState().menu.organism;

    return fetch(
      pumbaConfig.urlBackend +
        "/merge-protein/" +
        proteinId +
        "/organism/" +
        organism +
        "?dataSetsString=" +
        datasetIds
    )
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        // if protein is not found
        if (json.proteinMerges.length === 0) {
          dispatch(proteinLoadError("Could not find [" + proteinId + "]."));
          dispatch(proteinIsLoaded());
        } else {
          // add a timestamp to the data
          json.proteinMerges.timestamp = noReset
            ? getState().loadProtein.proteinData.timestamp
            : Date.now();

          // add the maximum protein intensity
          const maxProteinIntensity = _.max(
            _.map(json.proteinMerges, function (pd) {
              return _.max(
                _.map(pd.proteins, function (p) {
                  return _.max(p.intensities);
                })
              );
            })
          );
          dispatch(setProteinMaxIntensity(maxProteinIntensity));

          // add the maximum peptide intensity
          const maxPeptideIntensity = _.max(
            _.map(json.proteinMerges, function (pd) {
              return _.max(
                _.map(pd.proteins, function (p) {
                  return _.max(_.map(p.peptides, "intensity"));
                })
              );
            })
          );
          dispatch(setPeptideMaxIntensity(maxPeptideIntensity));

          // add the minimum peptide intensity
          const minPeptideIntensity = _.min(
            _.map(json.proteinMerges, function (pd) {
              return _.min(
                _.map(pd.proteins, function (p) {
                  return _.min(_.map(p.peptides, "intensity"));
                })
              );
            })
          );
          dispatch(setPeptideMinIntensity(minPeptideIntensity));

          // add a short version of the merged data for the gel view
          addShortMergedData(json.proteinMerges);

          if (!noReset) {
            // let's take the FASTA data from the first entry (should always be OK)
            dispatch(addSequenceData(json.mainSequence));
            dispatch(gotoViz(true));
            dispatch(setGelContrast(pumbaConfig.initialGelContrast));
            dispatch(setShowOnlyRazor(false));
            dispatch(setShowOnlyUnique(false));
            dispatch(setProteinMenuMaxIntensity(undefined));
            dispatch(setPeptideMenuMaxIntensity(0));
            dispatch(addIsoforms(json.sequences));
            dispatch(setDatasets(inactivateMissingDatasets(getState().loadProtein.datasets, json.proteinMerges)));

          }
          dispatch(addProteinData(json.proteinMerges));
          dispatch(proteinIsLoaded());

          // call the callback if there is a function
          if (callOnComplete) callOnComplete();

          // in case there is a zoom we have to reset the precalculated data
          if (noReset && getState().proteinViz.zoomLeft) {
            dispatch(
              computeTheoMergedProteins(
                getState().proteinViz.zoomLeft,
                getState().proteinViz.zoomRight
              )
            );
          }
        }
      })
      .catch((err) => {
        // we have to catch error messages differently for if backend is on or off.
        if (err.message) {
          dispatch(proteinLoadError(err.message));
        } else {
          err.text().then((message) => {
            dispatch(proteinLoadError(err.statusText + ": " + message));
          });
        }
        dispatch(proteinIsLoaded());
      });
  };
}

export function fetchDatasets(organism) {
  return function (dispatch) {
    // reset settings from the views
    dispatch(resetProteinView());
    dispatch(resetPeptideView());
    dispatch(resetSampleSelection());

    return fetch(pumbaConfig.urlBackend + "/dataset")
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        // parse a list of datasets and add them
        var idx = 0;

        const samples = _.reduce(
          json,
          (res, val) => {
            if (val.organism === organism) {
              if (!res[val.sample]) {
                res[val.sample] = {};
                res[val.sample].isChecked = true;
                res[val.sample].isActive = true;
                res[val.sample].isAvailable = true;
                res[val.sample].organism = val.organism;
                res[val.sample].datasets = [];
              }
              res[val.sample].datasets.push({
                id: val.id,
                name: val.name,
                isActive: true,
                colorGroup: val.colorGroup,
              });
            }
            return res;
          },
          {}
        );

        // order samples
        const sortedNames = Object.keys(samples).sort();

        const samplesWithIdx = _.keyBy(
          _.map(sortedNames, (name) => {
            var s = samples[name];
            s.datasets = _.map(s.datasets, (d, idx) => {
              d.idx = idx;
              return d;
            });
            s.idx = idx++;
            s.name = name;
            s.colorGroup = s.datasets[0].colorGroup;
            return s;
          }),
          "name"
        );

        dispatch(setSortedDatasetNames(sortedNames));
        dispatch(setDatasets(samplesWithIdx));
      })
      .catch((err) => {
        // we have to catch error messages differently for if backend is on or off.
        if (err.message) {
          dispatch(proteinLoadError(err.message));
        } else {
          err.text().then((message) => {
            dispatch(proteinLoadError(err.statusText + ": " + message));
          });
        }
      });
  };
}

export function fetchSuggestions(term, organism) {
  return function (dispatch) {
    if (term !== "") {
      return fetch(
        pumbaConfig.urlBackend +
          "/sequence-string/" +
          term +
          "/organism/" +
          organism
      )
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          dispatch(setSuggestions(json));
        })
        .catch((err) => {
          // we have to catch error messages differently for if backend is on or off.
          if (err.message) {
            dispatch(proteinLoadError(err.message));
          } else {
            err.text().then((message) => {
              dispatch(proteinLoadError(err.statusText + ": " + message));
            });
          }
        });
    } else {
      dispatch(setSuggestions([]));
    }
  };
}

export const setSuggestions = (suggestions) => ({
  type: SET_SUGGESTIONS,
  suggestions: suggestions,
});

export const setDatasets = (datasets) => ({
  type: SET_DATASETS,
  datasets: datasets,
});

export const addProteinData = (proteinData) => ({
  type: ADD_PROTEIN_DATA,
  proteinData: proteinData,
});

export const requestProtein = (proteinId) => ({
  type: REQUEST_PROTEIN,
  proteinId: proteinId,
});

export const proteinIsLoaded = (proteinData) => ({
  type: PROTEIN_IS_LOADED,
  proteinData: proteinData,
});

export const proteinLoadError = (error) => ({
  type: PROTEIN_LOAD_ERROR,
  error: error,
});

export const gotoViz = (gotoViz) => ({
  type: GOTO_VIZ,
  gotoViz: gotoViz,
});

export const addSequenceData = (sequenceData) => ({
  type: ADD_SEQUENCE_DATA,
  sequenceData: sequenceData,
});

export const setSortedDatasetNames = (datasetNames) => ({
  type: SET_SORTED_DATASET_NAMES,
  datasetNames: datasetNames,
});

export const selectDataset = (sampleIdx, replIdx, plotType) => ({
  type: SELECT_DATASET,
  sampleIdx: sampleIdx,
  replIdx: replIdx,
  plotType: plotType,
});

export const selectAllDatasets = (sampleIdx, plotType) => ({
  type: SELECT_ALL_DATASETS,
  sampleIdx: sampleIdx,
  plotType: plotType,
});

export const setProteinMaxIntensity = (maxIntensity) => ({
  type: SET_PROTEIN_MAX_INTENSITY,
  maxIntensity: maxIntensity,
});

export const setPeptideMaxIntensity = (maxIntensity) => ({
  type: SET_PEPTIDE_MAX_INTENSITY,
  maxIntensity: maxIntensity,
});

export const setPeptideMinIntensity = (minIntensity) => ({
  type: SET_PEPTIDE_MIN_INTENSITY,
  minIntensity: minIntensity,
});

export const addIsoforms = (isoforms) => ({
  type: ADD_ISOFORMS,
  isoforms: isoforms,
});
