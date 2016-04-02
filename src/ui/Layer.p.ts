class Layer {
    private _element;
    private _className;
    private _classSelectorName;
    private _width;
    private _height;
    private _layers;

    constructor(element, ...args) {
        this._element = element;
        this._classSelectorName = 'k-ui-layout-' + getRandomSuffix();
        this._className = 'k-ui k-ui-layout ' + this._classSelectorName;
        this._element.addClass(this._className);

        if (this._element[0].tagName == 'BODY') {
            grabBody(true);
        }

        this._initialize();
    }

    public layout() {
        var width = this._element.width();
        var height = this._element.height();
        var selfSizeChanged = this._width != width || this._height != height;

        if (!selfSizeChanged) {
            return false;
        }

        this._internalLayout();

        var elements = this._element.find('>div');

        for (var index = 0; index < elements.length; index++) {
            var element = elements.eq(index);
            (<any>element).k('layout');
        }

        return true;
    }

    public add(name, index = -1) {
        var layer = {
            name: name,
            element: $('<div class="k-full"></div>'),
        };

        if (index < 0) {
            index = this._layers.length + index + 1;
        }

        var element = this._layers[index].element;

        this._layers.splice(index, 0, [layer]);
        element.after(layer.element);
    }

    public get(selector) {
        if (typeof(selector) == 'number') {
            return this._layers[selector] ? this._layers[selector].element : null;
        } else if (typeof(selector) == 'string') {
            for (var i = 0; i < this._layers.length; i++) {
                if (this._layers[i].name == selector) {
                    return this._layers[i].element;
                }
            }
        } else if (typeof(selector) == 'function') {
            for (var i = 0; i < this._layers.length; i++) {
                if (selector({ name: this._layers[i].name, element: this._layers[i] })) {
                    return this._layers[i].element;
                }
            }
        }
    }

    public getAll(selector) {
        var result = [];

        if (typeof(selector) == 'number') {
            if (this._layers[selector]) {
                result.push(this._layers[selector].element[0]);
            }
        } else if (typeof(selector) == 'string') {
            for (var i = 0; i < this._layers.length; i++) {
                if (this._layers[i].name == selector) {
                    result.push(this._layers[i].element[0]);
                }
            }
        } else if (typeof(selector) == 'function') {
            for (var i = 0; i < this._layers.length; i++) {
                if (selector({ name: this._layers[i].name, element: this._layers[i] })) {
                    result.push(this._layers[i].element[0]);
                }
            }
        } else if (typeof(selector) == 'undefined') {
            for (var i = 0; i < this._layers.length; i++) {
                result.push(this._layers[i].element[0]);
            }
        }

        return $(result);
    }

    public show(indexOrNameOrPredictor) {
        var layers = this.getAll(indexOrNameOrPredictor);

        if (layers) {
            layers.show();
        }
    }

    public hide(indexOrNameOrPredictor) {
        var layers = this.getAll(indexOrNameOrPredictor);

        if (layers) {
            layers.hide();
        }
    }

    private _initialize() {
        this._layers = [];

        var childElements = this._element.find('>div');

        for (var i = 0; i < childElements.length; i++) {
            var element = childElements.eq(i);

            if (childElements.attr('k-ui-layer-name')) {
                element.addClass('k-full');

                var layer = {
                    name: name,
                    element: element,
                };

                this._layers.push(layer);
            }
        }
    }

    private _internalLayout() {
        this._element.addClass('k-relative');
    }
}

