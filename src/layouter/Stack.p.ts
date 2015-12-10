class Stack {
    private _element;
    private _className;
    private _style;
    private _direction;
    private _offsetName;
    private _lengthName;
    private _quadratureLengthName;

    constructor(element, direction) {
        this._direction = direction;

        this._element = element;
        this._className = 'kLayouter-' + getRandomSuffix();
        this._element.addClass(this._className);

        if (this._direction == 'vertical') {
            this._offsetName = 'top';
            this._offsetName = 'top';
            this._lengthName = 'height';
            this._quadratureLengthName = 'width';
        } else {
            this._offsetName = 'left';
            this._lengthName = 'width';
            this._quadratureLengthName = 'height';
        }
        if (this._element[0].tagName == 'BODY') {
            grabBody(true);
        }
        this.layout();
        this._element.on('kLayouter.sizeChanged', (e) => this._sizeChanged(e));
        this._element.on('kLayouter.relayout', (e) => this._relayout(e));
    }

    public layout() {
        var elements = this._element.find('>div');
        var css = new fundamental.CssTextBuilder();
        var options = [];
        var cssFixedHeight = '';

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var raw = element.attr('kLayouter-' + this._lengthName);
            var [length, unit] = splitIntoNumberAndUnit(raw);
            var option: any = {
                raw: raw,
                index: index,
                length: length,
                unit: unit,
                css: {},
            };

            options.push(option);

            if (raw == '?') {
                var realHeight;

                if (this._direction == 'vertical') {
                    realHeight = element[this._lengthName]();
                } else {
                    element.css('display', 'inline-block');
                    realHeight = element[this._lengthName]();
                    element.css('display', '');
                }

                option.length = realHeight;
                option.unit = 'px';
                cssFixedHeight += cssFixedHeight == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
            } else if (unit == 'px' || unit == '%') {
                cssFixedHeight += cssFixedHeight == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
            }
        }

        var offset = '0px';

        for (var index = 0; index < elements.length; index++) {
            var option = options[index];
            option.css.offset = 'calc(' + offset + ')';

            if (option.raw == '*') {
                offset += ' + (100% - (' + cssFixedHeight + '))';
                option.css.length = 'calc(100% - (' + cssFixedHeight + '))';
            } else if (option.unit == 'px' || option.unit == '%') {
                offset += ' + ' + option.length + option.unit;
                option.css.length = 'calc(' + option.length + option.unit + ')';
            } else if (option.unit == '%*') {
                offset += ' + (100% - (' + cssFixedHeight + ')) * ' + option.length + ' / 100';
                option.css.length = 'calc((100% - (' + cssFixedHeight + ')) * ' + option.length + ' / 100)';
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
                css.property(this._lengthName, option.css.length);
            }
            css.property(this._offsetName, option.css.offset);
            css.property(this._quadratureLengthName, 100, '%');
            css.property('position', 'absolute');
        }

        setStyle(this._className, css.toString());

        // FIXME: IE bug, unexpected scrollbar showing, so add this workaround here
        if (1) {
            element.css('overflow', 'hidden');
        }

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            element.trigger('kLayouter.sizeChanged', { target: element[0] });
        }
    }

    private _sizeChanged(e) {
        if (e.target == this._element[0]) {
            this.layout();
        }
    }

    private _relayout(e) {
        if (e.target == this._element[0]) {
            this.layout();
        }
    }
}

