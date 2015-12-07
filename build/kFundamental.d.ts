export interface IDisposable {
    dispose(): any;
}
/**
 * IDisposable interface
 * @interface k.fundamental.IDisposable
 * @see {@link k.fundamental.Disposer}
 */
/**
 * Dispose this object
 * @method k.fundamental.IDisposable#Dispose
 */
export declare function createError(number: any, name: any, message: any): Error;
export declare class Disposer {
    isDisposed: any;
    isDisposing: any;
    private _disposeCallback;
    private _disposables;
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
    constructor(disposeCallback?: any);
    /**
     * @method k.fundamental.Disposer#addDisposable
     * @param {object} disposable - An object which will be disposed when "this" is disposed. The object should implement {@link k.fundamental.IDisposable} or expose dispose function
     */
    addDisposable(disposable: any): void;
    /**
     * @method k.fundamental.Disposer#dispose
     */
    dispose(): void;
}
export declare class CssTextBuilder {
    private static _selectorState;
    private static _propertyState;
    private _state;
    private _buffer;
    constructor();
    pushSelector(selector: any): void;
    property(name: any, value: any, unit?: any): void;
    toString(): any;
}
export declare class DynamicStylesheet {
    disposer: any;
    private _element;
    private _stylesheetText;
    /**
     * This class is used to add dynamic stylesheet to the document. You can change the content of
     * the stylesheet in any time. The stylesheet is removed once the object is disposed. By changing
     * the content of the stylesheet, we can change a bunch of style in one time to improve the performance.
     *
     * @constructor k.fundamental.DynamicStylesheet
     * @param {string=} id - The id of the newly created stylesheet element
     */
    constructor(id: any);
    /**
     * @method k.fundamental.DynamicStylesheet#content
     * @param {string=} stylesheetText - Set/get the content of the stylesheet
     */
    content(stylesheetText: any): any;
}
