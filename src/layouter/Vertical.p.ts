class Vertical {
    private _element;
    private _className;
    private _style;

    constructor(element) {
        this._element = element;
        this._className = 'kl-vertical-' + getRandomSuffix();
        this._element.addClass(this._className);

        if (this._element[0].tagName == 'BODY') {
            grabBody(true);
        }
        this.layout();
    }

    private layout() {
        var elements = this._element.find('>div');
        var css = new fundamental.CssTextBuilder();
        var options = [];
        var cssFixedHeight = '';

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var [height, unit] = splitIntoNumberAndUnit(element.attr('data-kl-vertical-height'));
            var option: any = {
                index: index,
                height: height,
                unit: unit,
                css: {},
            };

            options.push(option);

            switch (unit) {
                case 'px':
                case '%':
                    cssFixedHeight += cssFixedHeight == '' ? option.height + option.unit : ' + ' + option.height + option.unit;
                    break;

                case '?':
                    var realHeight = element.height();

                    option.height = realHeight;
                    option.unit = 'px';
                    cssFixedHeight += cssFixedHeight == '' ? option.height + option.unit : ' + ' + option.height + option.unit;
                    break;
            }
        }

        var top = '0px';

        for (var index = 0; index < elements.length; index++) {
            var option = options[index];
            option.css.top = 'calc(' + top + ')';
            switch (option.unit) {
                case 'px':
                case '%':
                    top += ' + ' + option.height + option.unit;
                    option.css.height = 'calc(' + option.height + option.unit + ')';
                    break;

                case '%*':
                    top += ' + (100% - (' + cssFixedHeight + ')) * ' + option.height + ' / 100';
                    option.css.height = 'calc((100% - (' + cssFixedHeight + ')) * ' + option.height + ' / 100)';
                    break;

                case '*':
                    top += ' + (100% - (' + cssFixedHeight + '))';
                    option.css.height = 'calc(100% - (' + cssFixedHeight + '))';
                    break;
            }
        }

        css.pushSelector('.' + this._className);
        css.property('position', 'relative');

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            var option = options[index];

            element.addClass(this._className + '-' + index);
            css.pushSelector('.' + this._className + '>.' + this._className + '-' + index);
            css.property('height', option.css.height);
            css.property('top', option.css.top);
            css.property('width', 100, '%');
            css.property('position', 'absolute');
        }

        setStyle(this._className, css.toString());
    }
}

