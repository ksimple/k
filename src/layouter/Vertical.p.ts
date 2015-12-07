class Vertical {
    private _element;
    private _className;
    private _style;

    constructor(element) {
        this._element = element;
        this._className = 'kl-vertical-' + getRandomSuffix();
        this._element.addClass(this._className);
        this.layout();
    }

    private layout() {
        var elements = this._element.find('>div');
        var totalFixedHeight = 0;
        var css = new fundamental.CssTextBuilder();

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var [height, unit] = splitIntoNumberAndUnit(element.attr('data-kl-vertical-height'));

            css.pushSelector('.' + this._className);
            css.property('position', 'relative');
            if (unit == 'px') {
                totalFixedHeight += height;
                element.addClass(this._className + '-' + index);
                css.pushSelector('.' + this._className + '>.' + this._className + '-' + index);
                css.property('height', height, 'px');
                css.property('position', 'absolute');
            }
        }

        setStyle(this._className, css.toString());
    }
}

