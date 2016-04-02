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

var styles = {
    'k-relative': '.k-relative { position: relative; }',
    'k-full': '.k-full { position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px }',
}

var dynamicStyle = new fundamental.DynamicStylesheet('k-' + getRandomSuffix());

(function () {
    var text = '';

    for (var key in styles) {
        text += styles[key];
    }

    dynamicStyle.content(text);
})();

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
    (<any>$(document.body)).k('layout');
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

    if (root[0] == window || root[0] == document) {
        root = $(document.body);
    }

    var items = root.find('[k-type]');

    if (root.attr('k-type')) {
        items = $(root).add(items);
    }

    for (var i = 0; i < items.length; i++) {
        var item = items.eq(i);

        if (item[0]['k-item']) {
            continue;
        }

        switch (item.attr('k-type')) {
            case 'stack':
                item[0]['k-item'] = new Stack(item, item.attr('k-options'));
                break;

            case 'layer':
                item[0]['k-item'] = new Layer(item, item.attr('k-options'));
                break;
        }
    }
}

$.fn.extend({
    k: function (name?, ...args) {
        if (arguments.length == 0) {
            for (var i = 0; i < this.length; i++) {
                attach(this.eq(i));
            }
        } else {
            for (var i = 0; i < this.length; i++) {
                if (this.eq(i).attr('k-type')) {
                    var item = this[i]['k-item'];

                    if (!item) {
                        continue;
                    }

                    if (typeof(item[name]) == 'function') {
                        return item[name].apply(item, args);
                    } else {
                        console.warn('method ' + name + ' doesn\'t exist on the kItem with type ' + this.eq(i).attr('k-type'));
                    }
                }
                break;
            }
        }
    }
});

