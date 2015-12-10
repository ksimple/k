export class CssTextBuilder {
    public static defaultPretty = _DEBUG ? true : false;

    // Per http://jsperf.com/array-join-vs-string-connect
    // use string is faster than array join
    private static _selectorState = 0;
    private static _propertyState = 1;
    private _state;
    private _buffer;
    private _pretty;

    constructor(pretty?: boolean) {
        this._buffer = '';
        this._pretty = typeof(pretty) == 'undefined' ? CssTextBuilder.defaultPretty : pretty;
        this._state = CssTextBuilder._selectorState;
    }

    public pushSelector(selector) {
        if (this._state == CssTextBuilder._propertyState) {
            if (this._pretty) {
                this._buffer += '}\n';
            } else {
                this._buffer += '}';
            }
            this._state = CssTextBuilder._selectorState;
        }

        this._buffer += selector;
    }

    public property(name, value, unit?) {
        if (arguments.length > 2 && isNaN(value)) {
            throw(0, 'CssTextBuilder', 'cannot use unit when the second argument are NaN');
        }

        if (this._state == CssTextBuilder._selectorState) {
            if (this._pretty) {
                this._buffer += '\n{\n';
            } else {
                this._buffer += '{';
            }
            this._state = CssTextBuilder._propertyState;
        }

        if (this._pretty) {
            this._buffer += '    ';
        }

        this._buffer += name;
        this._buffer += ':';
        if (this._pretty) {
            this._buffer += ' ';
        }
        this._buffer += value;

        if (unit) {
            this._buffer += unit;
        }

        this._buffer += ';';

        if (this._pretty) {
            this._buffer += '\n';
        }
    }

    public toString() {
        if (this._state == CssTextBuilder._propertyState) {
            if (this._pretty) {
                this._buffer += '}\n';
            } else {
                this._buffer += '}';
            }
        }

        return this._buffer;
    }
}

