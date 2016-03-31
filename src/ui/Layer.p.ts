class Layer {
    private _element;
    private _className;
    private _classSelectorName;

    constructor(element, ...args) {
        this._element = element;
        this._classSelectorName = 'k-ui-layout-' + getRandomSuffix();
        this._className = 'k-ui k-ui-layout ' + this._classSelectorName;
        this._element.addClass(this._className);

        if (this._element[0].tagName == 'BODY') {
            grabBody(true);
        }
        this.layout(true);
    }

    public layout(childSizeChanged = false) {
    }
}

