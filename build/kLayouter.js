define("kLayouter", ["require", "exports", 'kFundamental', 'jquery'], function (require, exports, fundamental, $) {
    var Vertical = (function () {
        function Vertical(element) {
            this._element = element;
            this._className = 'kl-vertical-' + getRandomSuffix();
            this._element.addClass(this._className);
            this.layout();
        }
        Vertical.prototype.layout = function () {
            var elements = this._element.find('>div');
            var totalFixedHeight = 0;
            var css = new fundamental.CssTextBuilder();
            for (var index = 0; index < elements.length; index++) {
                var element = elements.eq(index);
                var _a = splitIntoNumberAndUnit(element.attr('data-kl-vertical-height')), height = _a[0], unit = _a[1];
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
        };
        return Vertical;
    })();
    var Horizontal = (function () {
        function Horizontal(element) {
            this._element = element;
        }
        return Horizontal;
    })();
    function getRandomSuffix() {
        return Math.floor(window.performance.now()) + '-' + Math.floor(Math.random() * 10000);
    }
    function splitIntoNumberAndUnit(value) {
        return value.match(/(\d*)(.*)/).slice(1);
    }
    var styles = {};
    var dynamicStyle = new fundamental.DynamicStylesheet('kLayouter-' + getRandomSuffix());
    function setStyle(key, value) {
        styles[key] = value;
        var text = '';
        for (var key in styles) {
            text += styles[key];
        }
        dynamicStyle.content(text);
    }
    function attach(root) {
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
    exports.attach = attach;
});
//# sourceMappingURL=kLayouter.js.map