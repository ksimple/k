define("kFundamental", ["require", "exports", 'jquery'], function (require, exports, $) {
    /**
     * IDisposable interface
     * @interface k.fundamental.IDisposable
     * @see {@link k.fundamental.Disposer}
     */
    /**
     * Dispose this object
     * @method k.fundamental.IDisposable#Dispose
     */
    function createError(number, name, message) {
        return new Error(number + ': [' + name + '] ' + message);
    }
    exports.createError = createError;
    var Disposer = (function () {
        /**
         * This callback is called when this object is disposing
         * @callback k.fundamental.Disposer~DisposeCallback
         */
        /**
         * This class is designed to manage lifecycle. A class which have lifecycle management
         * should be designed as following pattern
         *
         *     class classWithLifecycle {
         *         public disposer;
         *
         *         constructor() {
         *             this.disposer = new Disposer(() => {
         *                 // Do whatever you want to do in disposing
         *             });
         *         }
         *
         *         // This function is optional, keep the compatibility to IDisposable interface.
         *         // The owner disposer will call this.disposer.dispose first and then call this.dispose
         *         // as second choice
         *         public dispose() {
         *             this.disposer.dispose();
         *         }
         *     }
         *
         * The object owner need to call theObject.disposer.dispose() method to dispose the object.
         * The benefits of using this are:
         * 1. The Disposer class can handle the double dispose issue
         * 2. Object owner can use [addDisposable]{@link k.fundamental.Disposer#addDisposable} method to add the object to its disposer and it will
         * be disposed automatically the owner is disposing
         * 3. The constructor takes one callback to do extra dispose work. So developer can write dispose
         * logic close to the constructor and easy to find what didn't do in disposing
         *
         * @constructor k.fundamental.Disposer
         * @param {k.fundamental.Disposer~DisposeCallback=} disposeCallback - A callback will be called in disposing
         */
        function Disposer(disposeCallback) {
            /**
             * Indicates if the object is disposed
             * @member {boolean} k.fundamental.Disposer#isDisposed
             */
            this.isDisposed = false;
            /**
             * Indicates if the object is disposing
             * @member {boolean} k.fundamental.Disposer#isDisposing
             */
            this.isDisposing = false;
            this._disposeCallback = disposeCallback;
            this._disposables = [];
        }
        /**
         * @method k.fundamental.Disposer#addDisposable
         * @param {object} disposable - An object which will be disposed when "this" is disposed. The object should implement {@link k.fundamental.IDisposable} or expose dispose function
         */
        Disposer.prototype.addDisposable = function (disposable) {
            if (this.isDisposed || this.isDisposing) {
                if (disposable.disposer) {
                    disposable.disposer.dispose();
                }
                else if (disposable.dispose) {
                    disposable.dispose();
                }
                return;
            }
            this._disposables.push(disposable);
        };
        /**
         * @method k.fundamental.Disposer#dispose
         */
        Disposer.prototype.dispose = function () {
            if (this.isDisposed || this.isDisposing) {
                return;
            }
            this.isDisposing = true;
            if (this._disposeCallback) {
                this._disposeCallback();
            }
            for (var i = 0; i < this._disposables.length; i++) {
                if (this._disposables[i].disposer) {
                    this._disposables[i].disposer.dispose();
                }
                else if (this._disposables[i].dispose) {
                    this._disposables[i].dispose();
                }
            }
            this._disposables = null;
            this.isDisposed = true;
        };
        return Disposer;
    })();
    exports.Disposer = Disposer;
    var CssTextBuilder = (function () {
        function CssTextBuilder() {
            this._buffer = '';
            this._state = CssTextBuilder._selectorState;
        }
        CssTextBuilder.prototype.pushSelector = function (selector) {
            if (this._state == CssTextBuilder._propertyState) {
                this._buffer += '}';
                this._state = CssTextBuilder._selectorState;
            }
            this._buffer += selector;
        };
        CssTextBuilder.prototype.property = function (name, value, unit) {
            if (arguments.length > 2 && isNaN(value)) {
                throw (0, 'CssTextBuilder', 'cannot use unit when the second argument are NaN');
            }
            if (this._state == CssTextBuilder._selectorState) {
                this._buffer += '{';
                this._state = CssTextBuilder._propertyState;
            }
            this._buffer += name;
            this._buffer += ':';
            this._buffer += value;
            if (unit) {
                this._buffer += unit;
            }
            this._buffer += ';';
        };
        CssTextBuilder.prototype.toString = function () {
            if (this._state == CssTextBuilder._propertyState) {
                this._buffer += '}';
            }
            return this._buffer;
        };
        // Per http://jsperf.com/array-join-vs-string-connect
        // use string is faster than array join
        CssTextBuilder._selectorState = 0;
        CssTextBuilder._propertyState = 1;
        return CssTextBuilder;
    })();
    exports.CssTextBuilder = CssTextBuilder;
    var DynamicStylesheet = (function () {
        /**
         * This class is used to add dynamic stylesheet to the document. You can change the content of
         * the stylesheet in any time. The stylesheet is removed once the object is disposed. By changing
         * the content of the stylesheet, we can change a bunch of style in one time to improve the performance.
         *
         * @constructor k.fundamental.DynamicStylesheet
         * @param {string=} id - The id of the newly created stylesheet element
         */
        function DynamicStylesheet(id) {
            var _this = this;
            this._element = $('<style type="text/css"></style>');
            if (id) {
                this._element.attr('id', id);
            }
            $(document.head).append(this._element);
            this._stylesheetText = '';
            this.disposer = new Disposer(function () {
                _this._element.remove();
                _this._element = null;
                _this._stylesheetText = null;
            });
        }
        /**
         * @method k.fundamental.DynamicStylesheet#content
         * @param {string=} stylesheetText - Set/get the content of the stylesheet
         */
        DynamicStylesheet.prototype.content = function (stylesheetText) {
            if (this.disposer.isDisposed) {
                // FIXME: throw exception here!
                return;
            }
            if (arguments.length == 0) {
                return this._stylesheetText;
            }
            else {
                if (!stylesheetText) {
                    stylesheetText = '';
                }
                if (this._stylesheetText != stylesheetText) {
                    this._stylesheetText = stylesheetText;
                    if (this._element[0].styleSheet && !this._element[0].sheet) {
                        this._element[0].styleSheet.cssText = this._stylesheetText;
                    }
                    else {
                        this._element.html(this._stylesheetText);
                    }
                }
            }
        };
        return DynamicStylesheet;
    })();
    exports.DynamicStylesheet = DynamicStylesheet;
});
//# sourceMappingURL=kFundamental.js.map