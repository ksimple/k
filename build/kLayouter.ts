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

function setStyle(key, value) {
    styles[key] = value;

    var text = '';

    for (var key in styles) {
        text += styles[key];
    }

    dynamicStyle.content(text);
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



