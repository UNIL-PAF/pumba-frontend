
/**
 * options settings
 */

var optionsConfig = {};

optionsConfig.pepIntSliderSteps = 100

optionsConfig.computeRealIntValue = (pepMaxInt, pepMinInt, menuVal) => {
    if(! menuVal) return 0
    return Math.exp(Math.log(pepMaxInt-pepMinInt) * optionsConfig.pepIntSliderSteps / menuVal) + pepMinInt
}

module.exports = optionsConfig;
