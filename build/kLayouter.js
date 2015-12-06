define("kLayouter", ["require", "exports", 'jquery'], function (require, exports, $) {
    var Vertical = (function () {
        function Vertical(element) {
            alert('create');
            this._element = element;
        }
        return Vertical;
    })();
    function attach(element) {
        element = $(element);
        var items;
        if (element[0] == window) {
            items = $(document.body).find('.kl-item');
        }
        else {
            items = element.find('.kl-item');
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
            }
        }
    }
    exports.attach = attach;
});
//# sourceMappingURL=kLayouter.js.map