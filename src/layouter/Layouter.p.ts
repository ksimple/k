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

