define("kUI", ["require", "exports", 'kFundamental', 'jquery', "jquery.migrate"], function (require, exports, fundamental, $) {
    var _DEBUG = 0;
    var _DEBUG = 1;
    var Stack = (function () {
        function Stack(element, direction) {
            this._direction = direction;
            this._element = element;
            this._classSelectorName = 'k-ui-stack-' + getRandomSuffix();
            this._className = 'k-ui k-ui-stack ' + this._classSelectorName;
            this._element.addClass(this._className);
            if (this._direction == 'vertical') {
                this._offsetName = 'top';
                this._offsetName = 'top';
                this._lengthName = 'height';
                this._quadratureLengthName = 'width';
            }
            else {
                this._offsetName = 'left';
                this._lengthName = 'width';
                this._quadratureLengthName = 'height';
            }
            if (this._element[0].tagName == 'BODY') {
                grabBody(true);
            }
            this.layout(true);
        }
        Stack.prototype.layout = function (childSizeChanged) {
            if (childSizeChanged === void 0) { childSizeChanged = false; }
            if ($.browser.msie && $.browser.version < 9.0) {
                this._layoutByJavascript(childSizeChanged);
            }
            else {
                this._layoutByCssCalc(childSizeChanged);
            }
        };
        Stack.prototype._layoutByCssCalc = function (childSizeChanged) {
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
                var _a = splitIntoNumberAndUnit(raw), length = _a[0], unit = _a[1];
                var option = {
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
                        tempCss.pushSelector('.' + this._classSelectorName);
                        tempCss.property('position', 'relative');
                        tempCss.pushSelector('.' + this._classSelectorName + '>*');
                        tempCss.property('position', 'absolute');
                        setStyle(this._classSelectorName, tempCss.toString());
                        tempCssIsSet = true;
                    }
                    var realLength;
                    element.css('position', 'relative');
                    if (this._direction == 'vertical') {
                        realLength = element[this._lengthName]();
                    }
                    else {
                        element.css('display', 'inline-block');
                        realLength = element[this._lengthName]();
                        element.css('display', '');
                    }
                    element.css('position', '');
                    option.length = realLength;
                    option.unit = 'px';
                    cssFixedLength += cssFixedLength == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
                    cssFixedLengthWithoutPercentage += cssFixedLengthWithoutPercentage == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
                }
                else if (option.unit == 'px' || option.unit == '%') {
                    cssFixedLength += cssFixedLength == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
                    if (option.unit != '%') {
                        cssFixedLengthWithoutPercentage += cssFixedLengthWithoutPercentage == '' ? option.length + option.unit : ' + ' + option.length + option.unit;
                    }
                    else {
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
                }
                else if (option.unit == 'px' || option.unit == '%') {
                    offset += ' + ' + option.length + option.unit;
                    option.css.length = 'calc(' + option.length + option.unit + ')';
                }
                else if (option.unit == '%*') {
                    offset += ' + (100% - (' + cssFixedLength + ')) * ' + option.length + ' / 100';
                    option.css.length = 'calc((100% - (' + cssFixedLength + ')) * ' + option.length + ' / 100)';
                }
            }
            if (JSON.stringify(options) == this._lastChildOptions && selfSizeChanged) {
                return;
            }
            css.pushSelector('.' + this._classSelectorName);
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
                css.pushSelector('.' + this._classSelectorName + '>.' + this._classSelectorName + '-' + index);
                if (option.raw != '?') {
                    css.property(this._lengthName, option.css.length);
                }
                css.property(this._offsetName, option.css.offset);
                css.property(this._quadratureLengthName, 100, '%');
                css.property('position', 'absolute');
            }
            setStyle(this._classSelectorName, css.toString());
            this._width = this._element.width();
            this._height = this._element.height();
            this._lastChildOptions = JSON.stringify(options);
            for (var index = 0; index < elements.length; index++) {
                var element = elements.eq(index);
                element.k('layout');
            }
            if (this._element.parent() && selfSizeChanged) {
                this._element.parent().k('layout', true);
            }
        };
        Stack.prototype._layoutByJavascript = function (childSizeChanged) {
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
                var _a = splitIntoNumberAndUnit(raw), length = _a[0], unit = _a[1];
                var option = {
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
                        css.pushSelector('.' + this._classSelectorName);
                        css.property('position', 'relative');
                        css.pushSelector('.' + this._classSelectorName + '>*');
                        css.property('position', 'absolute');
                        setStyle(this._classSelectorName, css.toString());
                        tempCssIsSet = true;
                    }
                    var realLength;
                    element.css('position', 'relative');
                    if (this._direction == 'vertical') {
                        realLength = element[this._lengthName]();
                    }
                    else {
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
            css.pushSelector('.' + this._classSelectorName);
            css.property('position', 'relative');
            // FIXME: IE bug, unexpected scrollbar showing, so add this workaround here
            if (1) {
                css.property('overflow', 'hidden');
            }
            for (var index = 0; index < elements.length; index++) {
                var element = elements.eq(index);
                var option = options[index];
                element.addClass(this._classSelectorName + '-' + index);
                if (option.unit != 'px' && option.unit != '%') {
                    continue;
                }
                css.pushSelector('.' + this._classSelectorName + '>.' + this._classSelectorName + '-' + index);
                if (option.raw != '?') {
                    css.property(this._lengthName, option.length, option.unit);
                }
                css.property(this._quadratureLengthName, 100, '%');
                css.property('position', 'absolute');
            }
            setStyle(this._classSelectorName, css.toString());
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
                }
                else if (option.unit == '%*') {
                    option.length = (totalLength - totalFixedLength) * option.length / 100;
                    option.unit = 'px';
                }
                option.offset = offset;
                offset += option.length;
            }
            css = new fundamental.CssTextBuilder();
            css.pushSelector('.' + this._classSelectorName);
            css.property('position', 'relative');
            // FIXME: IE bug, unexpected scrollbar showing, so add this workaround here
            if (1) {
                css.property('overflow', 'hidden');
            }
            for (var index = 0; index < elements.length; index++) {
                var option = options[index];
                css.pushSelector('.' + this._classSelectorName + '>.' + this._classSelectorName + '-' + index);
                if (option.raw != '?') {
                    css.property(this._lengthName, option.length, option.unit);
                }
                css.property(this._offsetName, option.offset, option.unit);
                css.property(this._quadratureLengthName, 100, '%');
                css.property('position', 'absolute');
            }
            setStyle(this._classSelectorName, css.toString());
            this._width = this._element.width();
            this._height = this._element.height();
            this._lastChildOptions = JSON.stringify(options);
            for (var index = 0; index < elements.length; index++) {
                var element = elements.eq(index);
                element.k('layout');
            }
            if (this._element.parent() && selfSizeChanged) {
                this._element.parent().k('layout', true);
            }
        };
        return Stack;
    })();
    function getRandomSuffix() {
        if (window.performance && window.performance.now) {
            return Math.floor(window.performance.now()) + '-' + Math.floor(Math.random() * 10000);
        }
        else {
            return (new Date()).valueOf() + '-' + Math.floor(Math.random() * 10000);
        }
    }
    function splitIntoNumberAndUnit(value) {
        var _a = value.match(/(\d*)(.*)/).slice(1), length = _a[0], unit = _a[1];
        length = parseInt(length);
        return [length, unit];
    }
    var styles = {};
    var dynamicStyle = new fundamental.DynamicStylesheet('k-' + getRandomSuffix());
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
        $(document.body).k('layout');
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
            }
        }
    }
    $.fn.extend({
        k: function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (arguments.length == 0) {
                for (var i = 0; i < this.length; i++) {
                    attach(this.eq(i));
                }
            }
            else {
                for (var i = 0; i < this.length; i++) {
                    if (this.eq(i).attr('k-type')) {
                        var item = this[i]['k-item'];
                        if (!item) {
                            continue;
                        }
                        if (typeof (item[name]) == 'function') {
                            item[name].apply(item, args);
                        }
                        else {
                            console.warn('method ' + name + ' doesn\'t exist on the kItem with type ' + this.eq(i).attr('k-type'));
                        }
                    }
                    break;
                }
            }
        }
    });
});
//# sourceMappingURL=kUI.js.map