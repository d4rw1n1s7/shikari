export class FullSelector {
  public nthChildSelector: string;
  public tagSelector: string;
  public classNameSelectors: string[];
  public toString() {
    return this.tagSelector + this.classNameSelectors.join("") + this.nthChildSelector;
  }
}
