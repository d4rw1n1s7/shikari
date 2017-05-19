// tslint:disable:no-var-keyword
// tslint:disable:no-string-literal
/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as chai from "chai";
import { readFileSync } from "fs";
import * as phantom from "phantom";

const expect = chai.expect;
const urls = JSON.parse(readFileSync("./test/urls.json", "utf-8"));

describe("shikari.getCssSelector", () => {
  it("should return CSS selector for an element", (done) => {
    let testMethod: Function = (url: string, next: Function) => {
      if (url === null) { done(); }
      let instance: phantom.PhantomJS;
      let page: phantom.WebPage;
      phantom.create()
        .then((phantomInstance) => {
          instance = phantomInstance;
          return instance.createPage();
        })
        .then((pageInstance) => {
          page = pageInstance;
          return page.open(url);
        })
        .then((status) => {
          if (status !== "success") { throw "bad status"; }
          if (!page.injectJs("./browser/index.js")) { throw "shikari wasn't injected"; }
          return page.evaluate(function () {
            var elements = document.querySelectorAll("body *");
            var isSelectorValid = false;
            var shikari = new (<any>window).Shikari();
            for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
              var element = elements[elementIndex];
              var selector = shikari.getCssSelector(document, <HTMLElement>element);
              isSelectorValid = typeof (selector) === "string" && selector.length > 0 && document.querySelector(selector) === element;
              if (isSelectorValid === false) { break; }
            }
            return isSelectorValid;
          });
        })
        .then((result) => {
          instance.exit();
          try {
            expect(result).to.equal(true);
            done();
          } catch (error) {
            done(error);
          }
        })
        .catch((error) => { done(error); });
    };
    let urlIndex = 0;
    let getNextUrl: Function = () => {
      return urlIndex === urls.length ? null : urls[urlIndex++];
    };
    let testMethodWrapper: Function = (url: string, getNextUrlFunction: Function) => {
      testMethod(url, () => {
        testMethodWrapper(getNextUrlFunction());
      });
    };
    testMethodWrapper(getNextUrl(), getNextUrl);
  });
});
