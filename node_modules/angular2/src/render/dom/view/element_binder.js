'use strict';var lang_1 = require('angular2/src/facade/lang');
var DomElementBinder = (function () {
    function DomElementBinder(_a) {
        var _b = _a === void 0 ? {} : _a, textNodeIndices = _b.textNodeIndices, hasNestedProtoView = _b.hasNestedProtoView, eventLocals = _b.eventLocals, localEvents = _b.localEvents, globalEvents = _b.globalEvents, hasNativeShadowRoot = _b.hasNativeShadowRoot;
        this.textNodeIndices = textNodeIndices;
        this.hasNestedProtoView = hasNestedProtoView;
        this.eventLocals = eventLocals;
        this.localEvents = localEvents;
        this.globalEvents = globalEvents;
        this.hasNativeShadowRoot = lang_1.isPresent(hasNativeShadowRoot) ? hasNativeShadowRoot : false;
    }
    return DomElementBinder;
})();
exports.DomElementBinder = DomElementBinder;
var Event = (function () {
    function Event(name, target, fullName) {
        this.name = name;
        this.target = target;
        this.fullName = fullName;
    }
    return Event;
})();
exports.Event = Event;
var HostAction = (function () {
    function HostAction(actionName, actionExpression, expression) {
        this.actionName = actionName;
        this.actionExpression = actionExpression;
        this.expression = expression;
    }
    return HostAction;
})();
exports.HostAction = HostAction;
//# sourceMappingURL=element_binder.js.map