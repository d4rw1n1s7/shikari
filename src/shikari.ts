import { FullSelector } from "./fullSelector";

export class Shikari {
  public getCssSelector(document: HTMLDocument, element: HTMLElement): string {
    if (element.nodeType !== 1) {
      throw new Error("Invalid input - only HTMLElements or representations of them are supported!");
    }
    let currentElement: HTMLElement = element;
    let fullSelector: string = "";
    let fullSelectorSequence: FullSelector[] = [];
    while (currentElement !== document.body.parentElement) {
      let currentElementFullSelector = this.getElementFullSelector(currentElement);
      fullSelector = currentElementFullSelector.toString() + (fullSelector === "" ? "" : " > " + fullSelector);
      fullSelectorSequence.splice(0, 0, currentElementFullSelector);
      if (this.testSelector(document, element, fullSelector)) { break; }
      currentElement = currentElement.parentElement;
    }
    return this.getOptimalSelector(document, element, fullSelectorSequence);
  }
  private getOptimalSelector(document: HTMLDocument, element: HTMLElement, fullSelectorSequence: FullSelector[]): string {
    let selector: string = this.fullSelectorSequenceToSelector(fullSelectorSequence);
    for (let fullSelectorSequenceindex = 0; fullSelectorSequenceindex < fullSelectorSequence.length; fullSelectorSequenceindex++) {
      let testSelector: string = "";
      let nthChildSelector = fullSelectorSequence[fullSelectorSequenceindex].nthChildSelector;
      fullSelectorSequence[fullSelectorSequenceindex].nthChildSelector = "";
      testSelector = this.fullSelectorSequenceToSelector(fullSelectorSequence);
      if (fullSelectorSequence[fullSelectorSequenceindex].toString() === ""
        || !this.testSelector(document, element, testSelector)) {
        fullSelectorSequence[fullSelectorSequenceindex].nthChildSelector = nthChildSelector;
      } else { selector = testSelector; }
      let tagSelector = fullSelectorSequence[fullSelectorSequenceindex].tagSelector;
      fullSelectorSequence[fullSelectorSequenceindex].tagSelector = "";
      testSelector = this.fullSelectorSequenceToSelector(fullSelectorSequence);
      if (fullSelectorSequence[fullSelectorSequenceindex].toString() === ""
        || !this.testSelector(document, element, testSelector)) {
        fullSelectorSequence[fullSelectorSequenceindex].tagSelector = tagSelector;
      } else { selector = testSelector; }
      for (let index = 0; index < fullSelectorSequence[fullSelectorSequenceindex].classNameSelectors.length; index++) {
        let classNameSelector = fullSelectorSequence[fullSelectorSequenceindex].classNameSelectors[index];
        fullSelectorSequence[fullSelectorSequenceindex].classNameSelectors[index] = "";
        testSelector = this.fullSelectorSequenceToSelector(fullSelectorSequence);
        if (fullSelectorSequence[fullSelectorSequenceindex].toString() === ""
          || !this.testSelector(document, element, testSelector)) {
          fullSelectorSequence[fullSelectorSequenceindex].classNameSelectors[index] = classNameSelector;
        } else { selector = testSelector; }
      }
    }
    return selector;
  }
  private fullSelectorSequenceToSelector(fullSelectors: FullSelector[]) {
    let selector: string = fullSelectors[0].toString();
    for (let index = 1; index < fullSelectors.length; index++) {
      let fullSelector = fullSelectors[index];
      selector += " > " + fullSelector.toString();
    }
    return selector;
  }
  private testSelector(document: HTMLDocument, element: HTMLElement, selector: string): boolean {
    let foundElements: NodeListOf<Element> = document.querySelectorAll(selector);
    return foundElements.length === 1 && foundElements.item(0) === element;
  }
  private getElementFullSelector(element: HTMLElement): FullSelector {
    let fullSelector: FullSelector = new FullSelector();
    let nthChild: number = element.parentElement === null ? 1 : Array.prototype.indexOf.call(element.parentElement.children, element) + 1;
    fullSelector.nthChildSelector = ":nth-child(" + nthChild + ")";
    fullSelector.tagSelector = element.tagName;
    let classNames = element.classList;
    let classNameSelectors: string[] = [];
    for (let index = 0; index < classNames.length; index++) {
      let className = classNames[index];
      if (this.getIdentRegex().test(className)) {
        classNameSelectors.push("." + className);
      }
    }
    fullSelector.classNameSelectors = classNameSelectors;
    return fullSelector;
  }
  private getIdentRegex() {
    let h = "[0-9a-f]";
    let unicode = "\\\\{h}{1,6}(\\r\\n|[ \\t\\r\\n\\f])?".replace("{h}", h);
    let escape = "({unicode}|\\\\[^\\r\\n\\f0-9a-f])".replace("{unicode}", unicode);
    let nonascii = "[\\240-\\377]";
    let nmchar = "([_a-z0-9-]|{nonascii}|{escape})".replace("{nonascii}", nonascii).replace("{escape}", escape);
    let nmstart = "([_a-z]|{nonascii}|{escape})".replace("{nonascii}", nonascii).replace("{escape}", escape);
    let ident = "-?{nmstart}{nmchar}*".replace("{nmstart}", nmstart).replace("{nmchar}", nmchar);
    return new RegExp(ident, "i");
  };
}
