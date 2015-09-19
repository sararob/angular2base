'use strict';var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var view_ref_1 = require('./view_ref');
/**
 * A location where {@link ViewRef}s can be attached.
 *
 * A `ViewContainerRef` represents a location in a {@link ViewRef} where other child
 * {@link ViewRef}s can be inserted. Adding and removing views is the only way of structurally
 * changing the rendered DOM of the application.
 */
var ViewContainerRef = (function () {
    /**
     * @private
     */
    function ViewContainerRef(viewManager, element) {
        this.viewManager = viewManager;
        this.element = element;
    }
    ViewContainerRef.prototype._getViews = function () {
        var vc = view_ref_1.internalView(this.element.parentView).viewContainers[this.element.boundElementIndex];
        return lang_1.isPresent(vc) ? vc.views : [];
    };
    /**
     * Remove all {@link ViewRef}s at current location.
     */
    ViewContainerRef.prototype.clear = function () {
        for (var i = this.length - 1; i >= 0; i--) {
            this.remove(i);
        }
    };
    /**
     * Return a {@link ViewRef} at specific index.
     */
    ViewContainerRef.prototype.get = function (index) { return this._getViews()[index].ref; };
    Object.defineProperty(ViewContainerRef.prototype, "length", {
        /**
         * Returns number of {@link ViewRef}s currently attached at this location.
         */
        get: function () { return this._getViews().length; },
        enumerable: true,
        configurable: true
    });
    /**
     * Create and insert a {@link ViewRef} into the view-container.
     *
     * - `protoViewRef` (optional) {@link ProtoViewRef} - The `ProtoView` to use for creating
     *   `View` to be inserted at this location. If `ViewContainer` is created at a location
     *   of inline template, then `protoViewRef` is the `ProtoView` of the template.
     * - `atIndex` (optional) `number` - location of insertion point. (Or at the end if unspecified.)
     * - `context` (optional) {@link ElementRef} - Context (for expression evaluation) from the
     *   {@link ElementRef} location. (Or current context if unspecified.)
     * - `bindings` (optional) Array of {@link ResolvedBinding} - Used for configuring
     *   `ElementInjector`.
     *
     * Returns newly created {@link ViewRef}.
     */
    // TODO(rado): profile and decide whether bounds checks should be added
    // to the methods below.
    ViewContainerRef.prototype.createEmbeddedView = function (templateRef, atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        if (atIndex == -1)
            atIndex = this.length;
        return this.viewManager.createEmbeddedViewInContainer(this.element, atIndex, templateRef);
    };
    ViewContainerRef.prototype.createHostView = function (protoViewRef, atIndex, dynamicallyCreatedBindings) {
        if (protoViewRef === void 0) { protoViewRef = null; }
        if (atIndex === void 0) { atIndex = -1; }
        if (dynamicallyCreatedBindings === void 0) { dynamicallyCreatedBindings = null; }
        if (atIndex == -1)
            atIndex = this.length;
        return this.viewManager.createHostViewInContainer(this.element, atIndex, protoViewRef, dynamicallyCreatedBindings);
    };
    /**
     * Insert a {@link ViewRef} at specefic index.
     *
     * The index is location at which the {@link ViewRef} should be attached. If omitted it is
     * inserted at the end.
     *
     * Returns the inserted {@link ViewRef}.
     */
    ViewContainerRef.prototype.insert = function (viewRef, atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        if (atIndex == -1)
            atIndex = this.length;
        return this.viewManager.attachViewInContainer(this.element, atIndex, viewRef);
    };
    /**
     * Return the index of already inserted {@link ViewRef}.
     */
    ViewContainerRef.prototype.indexOf = function (viewRef) {
        return collection_1.ListWrapper.indexOf(this._getViews(), view_ref_1.internalView(viewRef));
    };
    /**
     * Remove a {@link ViewRef} at specific index.
     *
     * If the index is omitted last {@link ViewRef} is removed.
     */
    ViewContainerRef.prototype.remove = function (atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        if (atIndex == -1)
            atIndex = this.length - 1;
        this.viewManager.destroyViewInContainer(this.element, atIndex);
        // view is intentionally not returned to the client.
    };
    /**
     * The method can be used together with insert to implement a view move, i.e.
     * moving the dom nodes while the directives in the view stay intact.
     */
    ViewContainerRef.prototype.detach = function (atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        if (atIndex == -1)
            atIndex = this.length - 1;
        return this.viewManager.detachViewInContainer(this.element, atIndex);
    };
    return ViewContainerRef;
})();
exports.ViewContainerRef = ViewContainerRef;
//# sourceMappingURL=view_container_ref.js.map