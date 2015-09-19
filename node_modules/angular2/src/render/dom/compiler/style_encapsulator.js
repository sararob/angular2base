'use strict';var api_1 = require('../../api');
var util_1 = require('../util');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var shadow_css_1 = require('./shadow_css');
var StyleEncapsulator = (function () {
    function StyleEncapsulator(_appId, _view, _componentUIDsCache) {
        this._appId = _appId;
        this._view = _view;
        this._componentUIDsCache = _componentUIDsCache;
    }
    StyleEncapsulator.prototype.processElement = function (parent, current, control) {
        if (util_1.isElementWithTag(current.element, util_1.NG_CONTENT_ELEMENT_NAME)) {
            current.inheritedProtoView.bindNgContent();
        }
        else {
            if (this._view.encapsulation === api_1.ViewEncapsulation.EMULATED) {
                this._processEmulatedScopedElement(current, parent);
            }
        }
    };
    StyleEncapsulator.prototype.processStyle = function (style) {
        var encapsulation = this._view.encapsulation;
        if (encapsulation === api_1.ViewEncapsulation.EMULATED) {
            return this._shimCssForComponent(style, this._view.componentId);
        }
        else {
            return style;
        }
    };
    StyleEncapsulator.prototype._processEmulatedScopedElement = function (current, parent) {
        var element = current.element;
        var hostComponentId = this._view.componentId;
        var viewType = current.inheritedProtoView.type;
        // Shim the element as a child of the compiled component
        if (viewType !== api_1.ViewType.HOST && lang_1.isPresent(hostComponentId)) {
            var contentAttribute = getContentAttribute(this._getComponentId(hostComponentId));
            dom_adapter_1.DOM.setAttribute(element, contentAttribute, '');
            // also shim the host
            if (lang_1.isBlank(parent) && viewType == api_1.ViewType.COMPONENT) {
                var hostAttribute = getHostAttribute(this._getComponentId(hostComponentId));
                current.inheritedProtoView.setHostAttribute(hostAttribute, '');
            }
        }
    };
    StyleEncapsulator.prototype._shimCssForComponent = function (cssText, componentId) {
        var id = this._getComponentId(componentId);
        var shadowCss = new shadow_css_1.ShadowCss();
        return shadowCss.shimCssText(cssText, getContentAttribute(id), getHostAttribute(id));
    };
    StyleEncapsulator.prototype._getComponentId = function (componentStringId) {
        var id = this._componentUIDsCache.get(componentStringId);
        if (lang_1.isBlank(id)) {
            id = this._appId + "-" + this._componentUIDsCache.size;
            this._componentUIDsCache.set(componentStringId, id);
        }
        return id;
    };
    return StyleEncapsulator;
})();
exports.StyleEncapsulator = StyleEncapsulator;
// Return the attribute to be added to the component
function getHostAttribute(compId) {
    return "_nghost-" + compId;
}
// Returns the attribute to be added on every single element nodes in the component
function getContentAttribute(compId) {
    return "_ngcontent-" + compId;
}
//# sourceMappingURL=style_encapsulator.js.map