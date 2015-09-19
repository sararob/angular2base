'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var api_1 = require('../../api');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
function resolveInternalDomProtoView(protoViewRef) {
    return protoViewRef._protoView;
}
exports.resolveInternalDomProtoView = resolveInternalDomProtoView;
var DomProtoViewRef = (function (_super) {
    __extends(DomProtoViewRef, _super);
    function DomProtoViewRef(_protoView) {
        _super.call(this);
        this._protoView = _protoView;
    }
    return DomProtoViewRef;
})(api_1.RenderProtoViewRef);
exports.DomProtoViewRef = DomProtoViewRef;
var DomProtoView = (function () {
    // Note: fragments are separated by a comment node that is not counted in fragmentsRootNodeCount!
    function DomProtoView(type, cloneableTemplate, encapsulation, elementBinders, hostAttributes, rootTextNodeIndices, boundTextNodeCount, fragmentsRootNodeCount, isSingleElementFragment) {
        this.type = type;
        this.cloneableTemplate = cloneableTemplate;
        this.encapsulation = encapsulation;
        this.elementBinders = elementBinders;
        this.hostAttributes = hostAttributes;
        this.rootTextNodeIndices = rootTextNodeIndices;
        this.boundTextNodeCount = boundTextNodeCount;
        this.fragmentsRootNodeCount = fragmentsRootNodeCount;
        this.isSingleElementFragment = isSingleElementFragment;
    }
    DomProtoView.create = function (templateCloner, type, rootElement, viewEncapsulation, fragmentsRootNodeCount, rootTextNodeIndices, elementBinders, hostAttributes) {
        var boundTextNodeCount = rootTextNodeIndices.length;
        for (var i = 0; i < elementBinders.length; i++) {
            boundTextNodeCount += elementBinders[i].textNodeIndices.length;
        }
        var isSingleElementFragment = fragmentsRootNodeCount.length === 1 &&
            fragmentsRootNodeCount[0] === 1 &&
            dom_adapter_1.DOM.isElementNode(dom_adapter_1.DOM.firstChild(dom_adapter_1.DOM.content(rootElement)));
        return new DomProtoView(type, templateCloner.prepareForClone(rootElement), viewEncapsulation, elementBinders, hostAttributes, rootTextNodeIndices, boundTextNodeCount, fragmentsRootNodeCount, isSingleElementFragment);
    };
    return DomProtoView;
})();
exports.DomProtoView = DomProtoView;
//# sourceMappingURL=proto_view.js.map