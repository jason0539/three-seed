var Signal = require('signals');

export const GLOBAL_SIGNALS = new function () {
    this.addGeometryLand = new Signal();
};