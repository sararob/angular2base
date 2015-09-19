'use strict';var view_ref_1 = require('./view_ref');
/**
 * Reference to a template within a component.
 *
 * Represents an opaque reference to the underlying template that can
 * be instantiated using the {@link ViewContainerRef}.
 */
var TemplateRef = (function () {
    function TemplateRef(elementRef) {
        this.elementRef = elementRef;
    }
    TemplateRef.prototype._getProtoView = function () {
        var parentView = view_ref_1.internalView(this.elementRef.parentView);
        return parentView.proto
            .elementBinders[this.elementRef.boundElementIndex - parentView.elementOffset]
            .nestedProtoView;
    };
    Object.defineProperty(TemplateRef.prototype, "protoViewRef", {
        get: function () { return this._getProtoView().ref; },
        enumerable: true,
        configurable: true
    });
    /**
     * Whether this template has a local variable with the given name
     */
    TemplateRef.prototype.hasLocal = function (name) { return this._getProtoView().variableBindings.has(name); };
    return TemplateRef;
})();
exports.TemplateRef = TemplateRef;
//# sourceMappingURL=template_ref.js.map