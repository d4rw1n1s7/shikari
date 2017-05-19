"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fullSelector_1 = require("./fullSelector");
var Shikari = (function () {
    function Shikari() {
    }
    Shikari.prototype.getCssSelector = function (document, element) {
        if (element.nodeType !== 1) {
            throw new Error("Invalid input - only HTMLElements or representations of them are supported!");
        }
        var currentElement = element;
        var fullSelector = "";
        var fullSelectorSequence = [];
        while (currentElement !== document.body.parentElement) {
            var currentElementFullSelector = this.getElementFullSelector(currentElement);
            fullSelector = currentElementFullSelector.toString() + (fullSelector === "" ? "" : " > " + fullSelector);
            fullSelectorSequence.splice(0, 0, currentElementFullSelector);
            if (this.testSelector(document, element, fullSelector)) {
                break;
            }
            currentElement = currentElement.parentElement;
        }
        return this.getOptimalSelector(document, element, fullSelectorSequence);
    };
    Shikari.prototype.getOptimalSelector = function (document, element, fullSelectorSequence) {
        var selector = this.fullSelectorSequenceToSelector(fullSelectorSequence);
        for (var fullSelectorSequenceindex = 0; fullSelectorSequenceindex < fullSelectorSequence.length; fullSelectorSequenceindex++) {
            var testSelector = "";
            var nthChildSelector = fullSelectorSequence[fullSelectorSequenceindex].nthChildSelector;
            fullSelectorSequence[fullSelectorSequenceindex].nthChildSelector = "";
            testSelector = this.fullSelectorSequenceToSelector(fullSelectorSequence);
            if (fullSelectorSequence[fullSelectorSequenceindex].toString() === ""
                || !this.testSelector(document, element, testSelector)) {
                fullSelectorSequence[fullSelectorSequenceindex].nthChildSelector = nthChildSelector;
            }
            else {
                selector = testSelector;
            }
            var tagSelector = fullSelectorSequence[fullSelectorSequenceindex].tagSelector;
            fullSelectorSequence[fullSelectorSequenceindex].tagSelector = "";
            testSelector = this.fullSelectorSequenceToSelector(fullSelectorSequence);
            if (fullSelectorSequence[fullSelectorSequenceindex].toString() === ""
                || !this.testSelector(document, element, testSelector)) {
                fullSelectorSequence[fullSelectorSequenceindex].tagSelector = tagSelector;
            }
            else {
                selector = testSelector;
            }
            for (var index = 0; index < fullSelectorSequence[fullSelectorSequenceindex].classNameSelectors.length; index++) {
                var classNameSelector = fullSelectorSequence[fullSelectorSequenceindex].classNameSelectors[index];
                fullSelectorSequence[fullSelectorSequenceindex].classNameSelectors[index] = "";
                testSelector = this.fullSelectorSequenceToSelector(fullSelectorSequence);
                if (fullSelectorSequence[fullSelectorSequenceindex].toString() === ""
                    || !this.testSelector(document, element, testSelector)) {
                    fullSelectorSequence[fullSelectorSequenceindex].classNameSelectors[index] = classNameSelector;
                }
                else {
                    selector = testSelector;
                }
            }
        }
        return selector;
    };
    Shikari.prototype.fullSelectorSequenceToSelector = function (fullSelectors) {
        var selector = fullSelectors[0].toString();
        for (var index = 1; index < fullSelectors.length; index++) {
            var fullSelector = fullSelectors[index];
            selector += " > " + fullSelector.toString();
        }
        return selector;
    };
    Shikari.prototype.testSelector = function (document, element, selector) {
        var foundElements = document.querySelectorAll(selector);
        return foundElements.length === 1 && foundElements.item(0) === element;
    };
    Shikari.prototype.getElementFullSelector = function (element) {
        var fullSelector = new fullSelector_1.FullSelector();
        var nthChild = element.parentElement === null ? 1 : Array.prototype.indexOf.call(element.parentElement.children, element) + 1;
        fullSelector.nthChildSelector = ":nth-child(" + nthChild + ")";
        fullSelector.tagSelector = element.tagName;
        var classNames = element.classList;
        var classNameSelectors = [];
        for (var index = 0; index < classNames.length; index++) {
            var className = classNames[index];
            if (this.getIdentRegex().test(className)) {
                classNameSelectors.push("." + className);
            }
        }
        fullSelector.classNameSelectors = classNameSelectors;
        return fullSelector;
    };
    Shikari.prototype.getIdentRegex = function () {
        var h = "[0-9a-f]";
        var unicode = "\\\\{h}{1,6}(\\r\\n|[ \\t\\r\\n\\f])?".replace("{h}", h);
        var escape = "({unicode}|\\\\[^\\r\\n\\f0-9a-f])".replace("{unicode}", unicode);
        var nonascii = "[\\240-\\377]";
        var nmchar = "([_a-z0-9-]|{nonascii}|{escape})".replace("{nonascii}", nonascii).replace("{escape}", escape);
        var nmstart = "([_a-z]|{nonascii}|{escape})".replace("{nonascii}", nonascii).replace("{escape}", escape);
        var ident = "-?{nmstart}{nmchar}*".replace("{nmstart}", nmstart).replace("{nmchar}", nmchar);
        return new RegExp(ident, "i");
    };
    ;
    return Shikari;
}());
exports.Shikari = Shikari;
