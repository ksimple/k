function getRandomSuffix() {
    if (window.performance && window.performance.now) {
        return Math.floor(window.performance.now()) + '-' + Math.floor(Math.random() * 10000);
    } else {
        return (new Date()).valueOf() + '-' + Math.floor(Math.random() * 10000);
    }
}

function splitIntoNumberAndUnit(value) {
    var [length, unit] = value.match(/(\d*)(.*)/).slice(1);

    length = parseInt(length);
    return [length, unit];
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

function onWindowSizeChanged() {
    (<any>$(document.body)).kLayouter('layout');
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
        $(window).on('resize', onWindowSizeChanged);
    } else {
        setStyle('body');
        $(window).off('resize', onWindowSizeChanged);
    }
}

function attach(root) {
    root = $(root).eq(0);

    if (root[0] == window) {
        root = $(document.body);
    }

    var items = root.find('[kLayouter-type]');

    if (root.attr('kLayouter-type')) {
        items = $(root).add(items);
    }

    for (var i = 0; i < items.length; i++) {
        var item = items.eq(i);

        if (item[0]['kLayouter-item']) {
            continue;
        }

        switch (item.attr('kLayouter-type')) {
            case 'vertical':
                if ((<any>$).browser.msie && (<any>$).browser.version < 9.0) {
                    item[0]['kLayouter-item'] = new SelfCalculatedStack(item, 'vertical');
                } else {
                    item[0]['kLayouter-item'] = new Stack(item, 'vertical');
                }
                break;

            case 'horizontal':
                if ((<any>$).browser.msie && (<any>$).browser.version < 9.0) {
                    item[0]['kLayouter-item'] = new SelfCalculatedStack(item, 'horizontal');
                } else {
                    item[0]['kLayouter-item'] = new Stack(item, 'horizontal');
                }
                break;
        }
    }
}

$.fn.extend({
    kLayouter: function (name?, ...args) {
        if (arguments.length == 0) {
            for (var i = 0; i < this.length; i++) {
                attach(this.eq(i));
            }
        } else {
            switch (name) {
                case 'layout':
                    for (var i = 0; i < this.length; i++) {
                        var layouter = this[i]['kLayouter-item'];

                        if (layouter) {
                            if (typeof(args[0]) != 'undefined') {
                                layouter.layout(args[0]);
                            } else {
                                layouter.layout();
                            }
                        }
                    }
                    break;
            }
        }
    }
});

