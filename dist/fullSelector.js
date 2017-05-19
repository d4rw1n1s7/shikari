"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FullSelector = (function () {
    function FullSelector() {
    }
    FullSelector.prototype.toString = function () {
        return this.tagSelector + this.classNameSelectors.join("") + this.nthChildSelector;
    };
    return FullSelector;
}());
exports.FullSelector = FullSelector;
