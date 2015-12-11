class Stack {
    private _element;
    private _className;
    private _style;
    private _direction;
    private _offsetName;
    private _lengthName;
    private _quadratureLengthName;
    private _width;
    private _height;
    private _lastChildOptions;

    constructor(element, direction) {
        this._direction = direction;

        this._element = element;
        this._className = 'k-ui-stack-' + getRandomSuffix();
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
        this.layout(true);
    }

    public layout(childSizeChanged = false) {
        if ((<any>$).browser.msie && (<any>$).browser.version < 9.0) {
            this._layoutByJavascript(childSizeChanged);
        } else {
            this._layoutByCssCalc(childSizeChanged);
        }
    }

    private _layoutByCssCalc(childSizeChanged) {
        var width = this._element.width();
        var height = this._element.height();
        var selfSizeChanged = this._width != width || this._height != height;

        if (!childSizeChanged && selfSizeChanged) {
            return;
        }

        var elements = this._element.find('>div');
        var css = new fundamental.CssTextBuilder();
        var options = [];
        var cssFixedLength = '';
        var cssFixedLengthWithoutPercentage = '';
        var totalFixedPercentage = 0;
        var tempCssIsSet = false;

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var raw = element.attr('k-ui-stack-' + this._lengthName);
            var [length, unit] = splitIntoNumberAndUnit(raw);
            var option: any = {
                raw: raw,
                index: index,
                length: length,
                unit: unit,
                css: {}
            };

            options.push(option);

            if (raw == '?') {
                if (!tempCssIsSet) {
                    var tempCss = new fundamental.CssTextBuilder();

                    tempCss.pushSelector('.' + this._className);
                    tempCss.property('position', 'relative');
                    tempCss.pushSelector('.' + this._className + '>*');
                    tempCss.property('position', 'absolute');
                    setStyle(this._className, tempCss.toString());
                    tempCssIsSet = true;
                }

                var realLength;
                element.css('position', 'relative');

                if (this._direction == 'vertical') {
                    realLength = element[this._lengthName]();
                } else {
                    element.css('display', 'inline-block');
                    realLength = element[this._lengthName]();
                    element.css('display', '');
                }
                element.css('position', '');

                option.length = realLength;
                option.unit = 'px';
                cssFixedLength += cssFixedLength == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
                cssFixedLengthWithoutPercentage += cssFixedLengthWithoutPercentage == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
            } else if (option.unit == 'px' || option.unit == '%') {
                cssFixedLength += cssFixedLength == '' ? option.length + option.unit : ' + ' + option.length + option.unit;

                if (option.unit != '%') {
                    cssFixedLengthWithoutPercentage += cssFixedLengthWithoutPercentage == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
                } else {
                    totalFixedPercentage += option.length;
                }
            }
        }

        var offset = '0px';

        for (var index = 0; index < elements.length; index++) {
            var option = options[index];
            option.css.offset = 'calc(' + offset + ')';

            if (option.raw == '*') {
                offset += ' + (100% - (' + cssFixedLength + '))';
                option.css.length = 'calc(100% - (' + cssFixedLength + '))';
            } else if (option.unit == 'px' || option.unit == '%') {
                offset += ' + ' + option.length + option.unit;
                option.css.length = 'calc(' + option.length + option.unit + ')';
            } else if (option.unit == '%*') {
                offset += ' + (100% - (' + cssFixedLength + ')) * ' + option.length + ' / 100';
                option.css.length = 'calc((100% - (' + cssFixedLength + ')) * ' + option.length + ' / 100)';
            }
        }

        if (JSON.stringify(options) == this._lastChildOptions && selfSizeChanged) {
            return;
        }

        css.pushSelector('.' + this._className);
        css.property('position', 'relative');
        css.property('min-' + this._lengthName, 'calc((' + cssFixedLengthWithoutPercentage + ') / ' + (100 - totalFixedPercentage) + ' * 100)');
        // FIXME: IE bug, unexpected scrollbar showing, so add this workaround here
        if (1) {
            css.property('overflow', 'hidden');
        }

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

        this._width = this._element.width();
        this._height = this._element.height();
        this._lastChildOptions = JSON.stringify(options);

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            (<any>element).k('layout');
        }

        if (this._element.parent() && selfSizeChanged) {
            (<any>this._element.parent()).k('layout', true);
        }
    }

    private _layoutByJavascript(childSizeChanged) {
        var width = this._element.width();
        var height = this._element.height();
        var selfSizeChanged = this._width != width || this._height != height;

        if (!childSizeChanged && !selfSizeChanged) {
            return;
        }

        var elements = this._element.find('>div');
        var css = null;
        var options = [];
        var tempCssIsSet = false;

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var raw = element.attr('k-ui-stack-' + this._lengthName);
            var [length, unit] = splitIntoNumberAndUnit(raw);
            var option: any = {
                raw: raw,
                index: index,
                length: length,
                unit: unit
            };

            options.push(option);

            if (raw != '?' && raw != '*' && unit != 'px' && unit != '%*' && unit != '%') {
                throw fundamental.createError(0, 'k.ui.Stack', 'Unsupported unit ' + option.raw);
            }

            if (raw == '?') {
                if (!tempCssIsSet) {
                    css = new fundamental.CssTextBuilder();

                    css.pushSelector('.' + this._className);
                    css.property('position', 'relative');
                    css.pushSelector('.' + this._className + '>*');
                    css.property('position', 'absolute');
                    setStyle(this._className, css.toString());
                    tempCssIsSet = true;
                }

                var realLength;
                element.css('position', 'relative');

                if (this._direction == 'vertical') {
                    realLength = element[this._lengthName]();
                } else {
                    element.css('display', 'inline-block');
                    realLength = element[this._lengthName]();
                    element.css('display', '');
                }
                element.css('position', '');

                option.length = realLength;
                option.unit = 'px';
            }
        }

        if (JSON.stringify(options) == this._lastChildOptions && !selfSizeChanged) {
            return;
        }

        css = new fundamental.CssTextBuilder();
        css.pushSelector('.' + this._className);
        css.property('position', 'relative');
        // FIXME: IE bug, unexpected scrollbar showing, so add this workaround here
        if (1) {
            css.property('overflow', 'hidden');
        }

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var option = options[index];

            element.addClass(this._className + '-' + index);

            if (option.unit != 'px' && option.unit != '%') {
                continue;
            }

            css.pushSelector('.' + this._className + '>.' + this._className + '-' + index);
            if (option.raw != '?') {
                css.property(this._lengthName, option.length, option.unit);
            }
            css.property(this._quadratureLengthName, 100, '%');
            css.property('position', 'absolute');
        }

        setStyle(this._className, css.toString());

        var totalFixedLength = 0;
        var totalLength = this._element[this._lengthName]();

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var option = options[index];

            if (option.raw != '?' && option.unit != 'px' && option.unit != '%') {
                continue;
            }

            if (option.unit != 'px') {
                option.length = element[this._lengthName]();
                option.unit = 'px';
            }
            totalFixedLength += option.length;
        }

        var offset = 0;

        if (totalFixedLength > totalLength) {
            totalFixedLength = totalLength;
        }

        for (var index = 0; index < elements.length; index++) {
            var option = options[index];

            if (option.raw == '*') {
                option.length = totalLength - totalFixedLength;
                option.unit = 'px';
            } else if (option.unit == '%*') {
                option.length = (totalLength - totalFixedLength) * option.length / 100;
                option.unit = 'px';
            }

            option.offset = offset;
            offset += option.length;
        }

        css = new fundamental.CssTextBuilder();
        css.pushSelector('.' + this._className);
        css.property('position', 'relative');
        // FIXME: IE bug, unexpected scrollbar showing, so add this workaround here
        if (1) {
            css.property('overflow', 'hidden');
        }

        for (var index = 0; index < elements.length; index++) {
            var option = options[index];


            css.pushSelector('.' + this._className + '>.' + this._className + '-' + index);
            if (option.raw != '?') {
                css.property(this._lengthName, option.length, option.unit);
            }
            css.property(this._offsetName, option.offset, option.unit);
            css.property(this._quadratureLengthName, 100, '%');
            css.property('position', 'absolute');
        }

        setStyle(this._className, css.toString());

        this._width = this._element.width();
        this._height = this._element.height();
        this._lastChildOptions = JSON.stringify(options);

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            (<any>element).k('layout');
        }

        if (this._element.parent() && selfSizeChanged) {
            (<any>this._element.parent()).k('layout', true);
        }
    }
}

