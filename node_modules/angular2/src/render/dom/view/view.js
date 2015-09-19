'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var api_1 = require('../../api');
var util_1 = require('../util');
function resolveInternalDomView(viewRef) {
    return viewRef._view;
}
exports.resolveInternalDomView = resolveInternalDomView;
var DomViewRef = (function (_super) {
    __extends(DomViewRef, _super);
    function DomViewRef(_view) {
        _super.call(this);
        this._view = _view;
    }
    return DomViewRef;
})(api_1.RenderViewRef);
exports.DomViewRef = DomViewRef;
/**
 * Const of making objects: http://jsperf.com/instantiate-size-of-object
 */
var DomView = (function () {
    function DomView(proto, boundTextNodes, boundElements) {
        this.proto = proto;
        this.boundTextNodes = boundTextNodes;
        this.boundElements = boundElements;
        this.hydrated = false;
        this.eventDispatcher = null;
        this.eventHandlerRemovers = [];
    }
    DomView.prototype.setElementProperty = function (elementIndex, propertyName, value) {
        dom_adapter_1.DOM.setProperty(this.boundElements[elementIndex], propertyName, value);
    };
    DomView.prototype.setElementAttribute = function (elementIndex, attributeName, value) {
        var element = this.boundElements[elementIndex];
        var dashCasedAttributeName = util_1.camelCaseToDashCase(attributeName);
        if (lang_1.isPresent(value)) {
            dom_adapter_1.DOM.setAttribute(element, dashCasedAttributeName, lang_1.stringify(value));
        }
        else {
            dom_adapter_1.DOM.removeAttribute(element, dashCasedAttributeName);
        }
    };
    DomView.prototype.setElementClass = function (elementIndex, className, isAdd) {
        var element = this.boundElements[elementIndex];
        if (isAdd) {
            dom_adapter_1.DOM.addClass(element, className);
        }
        else {
            dom_adapter_1.DOM.removeClass(element, className);
        }
    };
    DomView.prototype.setElementStyle = function (elementIndex, styleName, value) {
        var element = this.boundElements[elementIndex];
        var dashCasedStyleName = util_1.camelCaseToDashCase(styleName);
        if (lang_1.isPresent(value)) {
            dom_adapter_1.DOM.setStyle(element, dashCasedStyleName, lang_1.stringify(value));
        }
        else {
            dom_adapter_1.DOM.removeStyle(element, dashCasedStyleName);
        }
    };
    DomView.prototype.invokeElementMethod = function (elementIndex, methodName, args) {
        var element = this.boundElements[elementIndex];
        dom_adapter_1.DOM.invoke(element, methodName, args);
    };
    DomView.prototype.setText = function (textIndex, value) { dom_adapter_1.DOM.setText(this.boundTextNodes[textIndex], value); };
    DomView.prototype.dispatchEvent = function (elementIndex, eventName, event) {
        var allowDefaultBehavior = true;
        if (lang_1.isPresent(this.eventDispatcher)) {
            var evalLocals = new collection_1.Map();
            evalLocals.set('$event', event);
            // TODO(tbosch): reenable this when we are parsing element properties
            // out of action expressions
            // var localValues = this.proto.elementBinders[elementIndex].eventLocals.eval(null, new
            // Locals(null, evalLocals));
            // this.eventDispatcher.dispatchEvent(elementIndex, eventName, localValues);
            allowDefaultBehavior =
                this.eventDispatcher.dispatchRenderEvent(elementIndex, eventName, evalLocals);
            if (!allowDefaultBehavior) {
                dom_adapter_1.DOM.preventDefault(event);
            }
        }
        return allowDefaultBehavior;
    };
    return DomView;
})();
exports.DomView = DomView;
//# sourceMappingURL=view.js.map