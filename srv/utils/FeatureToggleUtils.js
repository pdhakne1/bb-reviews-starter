"use strict";
const featureToggles = require("../config/FeatureToggles");

module.exports = {
    isActive(toggleName) {
        // TODO: error handling is needed
        return Boolean(featureToggles[toggleName] && featureToggles[toggleName].defaultOn);
    }
};
