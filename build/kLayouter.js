define("kLayouter", ["require", "exports", 'kFundamental', 'jquery'], function (require, exports, fundamental, $) {
    var Vertical = (function () {
        function Vertical(element) {
            var _this = this;
            this._element = element;
            this._className = 'kLayouter-' + getRandomSuffix();
            this._element.addClass(this._className);
            if (this._element[0].tagName == 'BODY') {
                grabBody(true);
            }
            this.layout();
            this._element.on('kLayouter.sizeChanged', function () { return _this._sizeChanged(); });
            this._element.on('kLayouter.relayout', function () { return _this.layout(); });
        }
        Vertical.prototype.layout = function () {
            var elements = this._element.find('>div');
            var css = new fundamental.CssTextBuilder();
            var options = [];
            var cssFixedHeight = '';
            for (var index = 0; index < elements.length; index++) {
                var element = elements.eq(index);
                var raw = element.attr('kLayouter-height');
                var _a = splitIntoNumberAndUnit(raw), height = _a[0], unit = _a[1];
                var option = {
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
                }
                else if (unit == 'px' || unit == '%') {
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
                }
                else if (option.unit == 'px' || option.unit == '%') {
                    top += ' + ' + option.height + option.unit;
                    option.css.height = 'calc(' + option.height + option.unit + ')';
                }
                else if (option.unit == '%*') {
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
        };
        Vertical.prototype._sizeChanged = function () {
            this.layout();
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
        if (value) {
            styles[key] = value;
        }
        else {
            delete styles[key];
        }
        var text = '';
        for (var key in styles) {
            text += styles[key];
        }
        dynamicStyle.content(text);
    }
    function onWindowSizeChanged() {
        $(document.body).trigger('kLayouter.sizeChanged');
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
        }
        else {
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
            if (item.data('kl-item')) {
                continue;
            }
            switch (item.attr('kLayouter-type')) {
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