/// <amd-module name="kLayouter"/>
import fundamental = require('kFundamental');
import $ = require('jquery');


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


class Horizontal {
    private _element;

    constructor(element) {
        this._element = element;
    }
}


function getRandomSuffix() {
    return Math.floor(window.performance.now()) + '-' + Math.floor(Math.random() * 10000);
}

function splitIntoNumberAndUnit(value) {
    return value.match(/(\d*)(.*)/).slice(1);
}

var styles = {}
var dynamicStyle = new fundamental.DynamicStylesheet('kLayouter-' + getRandomSuffix());

function setStyle(key, value?) {
    if (value) {
        styles[key] = value;
    } else {
        delete styles[key];
    }

    var text = '';

    for (var key in styles) {
        text += styles[key];
    }

    dynamicStyle.content(text);
}

function grabBody(grab) {
    if (grab) {
        var css = new fundamental.CssTextBuilder();

        css.pushSelector('html, body');
        css.property('position', 'absolute');
        css.property('width', '100%');
        css.property('height', '100%');
        css.property('border', '0px');
        css.property('margin', 0, 'px');
        css.property('padding', 0, 'px');
        setStyle('body', css.toString());
    } else {
        setStyle('body');
    }
}

export function attach(root) {
    root = $(root).eq(0);

    if (root[0] == window) {
        root = $(document.body);
    }

    var items = root.find('[data-kl-type]');

    if (root.attr('data-kl-type')) {
        items = $(root).add(items);
    }

    for (var i = 0; i < items.length; i++) {
        var item = items.eq(i);

        if (item.data('kl-item')) {
            continue;
        }

        switch (item.attr('data-kl-type')) {
            case 'vertical':
                item.data('kl-item', new Vertical(item));
                break;

            case 'horizontal':
                item.data('kl-item', new Horizontal(item));
                break;
        }
    }
}



