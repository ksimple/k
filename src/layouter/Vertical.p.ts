class Vertical {
    private _element;
    private _className;
    private _style;

    constructor(element) {
        this._element = element;
        this._className = 'kLayouter-' + getRandomSuffix();
        this._element.addClass(this._className);

        if (this._element[0].tagName == 'BODY') {
            grabBody(true);
        }
        this.layout();
        this._element.on('kLayouter.sizeChanged', () => this._sizeChanged());
        this._element.on('kLayouter.relayout', () => this.layout());
    }

    public layout() {
        var elements = this._element.find('>div');
        var css = new fundamental.CssTextBuilder();
        var options = [];
        var cssFixedHeight = '';

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var raw = element.attr('kLayouter-height');
            var [height, unit] = splitIntoNumberAndUnit(raw);
            var option: any = {
                raw: raw,
                index: index,
                height: height,
                unit: unit,
                css: {},
            };

            options.push(option);

            if (raw == '?') {
                var realHeight = element.height();

                option.height = realHeight;
                option.unit = 'px';
                cssFixedHeight += cssFixedHeight == '' ? option.height + option.unit : ' + ' + option.height + option.unit;
            } else if (unit == 'px' || unit == '%') {
                cssFixedHeight += cssFixedHeight == '' ? option.height + option.unit : ' + ' + option.height + option.unit;
            }
        }

        var top = '0px';

        for (var index = 0; index < elements.length; index++) {
            var option = options[index];
            option.css.top = 'calc(' + top + ')';

            if (option.raw == '*') {
                top += ' + (100% - (' + cssFixedHeight + '))';
                option.css.height = 'calc(100% - (' + cssFixedHeight + '))';
            } else if (option.unit == 'px' || option.unit == '%') {
                top += ' + ' + option.height + option.unit;
                option.css.height = 'calc(' + option.height + option.unit + ')';
            } else if (option.unit == '%*') {
                top += ' + (100% - (' + cssFixedHeight + ')) * ' + option.height + ' / 100';
                option.css.height = 'calc((100% - (' + cssFixedHeight + ')) * ' + option.height + ' / 100)';
            }
        }

        css.pushSelector('.' + this._className);
        css.property('position', 'relative');

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var option = options[index];

            element.addClass(this._className + '-' + index);
            css.pushSelector('.' + this._className + '>.' + this._className + '-' + index);
            if (option.raw != '?') {
                css.property('height', option.css.height);
            }
            css.property('top', option.css.top);
            css.property('width', 100, '%');
            css.property('position', 'absolute');
        }

        setStyle(this._className, css.toString());
    }

    private _sizeChanged() {
        this.layout();
    }
}

