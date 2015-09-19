'use strict';var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
exports.NG_BINDING_CLASS_SELECTOR = '.ng-binding';
exports.NG_BINDING_CLASS = 'ng-binding';
exports.EVENT_TARGET_SEPARATOR = ':';
exports.NG_CONTENT_ELEMENT_NAME = 'ng-content';
exports.NG_SHADOW_ROOT_ELEMENT_NAME = 'shadow-root';
var MAX_IN_MEMORY_ELEMENTS_PER_TEMPLATE = 20;
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
function camelCaseToDashCase(input) {
    return lang_1.StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, function (m) { return '-' + m[1].toLowerCase(); });
}
exports.camelCaseToDashCase = camelCaseToDashCase;
function dashCaseToCamelCase(input) {
    return lang_1.StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, function (m) { return m[1].toUpperCase(); });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
// Attention: This is on the hot path, so don't use closures or default values!
function queryBoundElements(templateContent, isSingleElementChild) {
    var result;
    var dynamicElementList;
    var elementIdx = 0;
    if (isSingleElementChild) {
        var rootElement = dom_adapter_1.DOM.firstChild(templateContent);
        var rootHasBinding = dom_adapter_1.DOM.hasClass(rootElement, exports.NG_BINDING_CLASS);
        dynamicElementList = dom_adapter_1.DOM.getElementsByClassName(rootElement, exports.NG_BINDING_CLASS);
        result = collection_1.ListWrapper.createFixedSize(dynamicElementList.length + (rootHasBinding ? 1 : 0));
        if (rootHasBinding) {
            result[elementIdx++] = rootElement;
        }
    }
    else {
        dynamicElementList = dom_adapter_1.DOM.querySelectorAll(templateContent, exports.NG_BINDING_CLASS_SELECTOR);
        result = collection_1.ListWrapper.createFixedSize(dynamicElementList.length);
    }
    for (var i = 0; i < dynamicElementList.length; i++) {
        result[elementIdx++] = dynamicElementList[i];
    }
    return result;
}
exports.queryBoundElements = queryBoundElements;
var ClonedProtoView = (function () {
    function ClonedProtoView(original, fragments, boundElements, boundTextNodes) {
        this.original = original;
        this.fragments = fragments;
        this.boundElements = boundElements;
        this.boundTextNodes = boundTextNodes;
    }
    return ClonedProtoView;
})();
exports.ClonedProtoView = ClonedProtoView;
function cloneAndQueryProtoView(templateCloner, pv, importIntoDocument) {
    var templateContent = templateCloner.cloneContent(pv.cloneableTemplate, importIntoDocument);
    var boundElements = queryBoundElements(templateContent, pv.isSingleElementFragment);
    var boundTextNodes = queryBoundTextNodes(templateContent, pv.rootTextNodeIndices, boundElements, pv.elementBinders, pv.boundTextNodeCount);
    var fragments = queryFragments(templateContent, pv.fragmentsRootNodeCount);
    return new ClonedProtoView(pv, fragments, boundElements, boundTextNodes);
}
exports.cloneAndQueryProtoView = cloneAndQueryProtoView;
function queryFragments(templateContent, fragmentsRootNodeCount) {
    var fragments = collection_1.ListWrapper.createGrowableSize(fragmentsRootNodeCount.length);
    // Note: An explicit loop is the fastest way to convert a DOM array into a JS array!
    var childNode = dom_adapter_1.DOM.firstChild(templateContent);
    for (var fragmentIndex = 0; fragmentIndex < fragments.length; fragmentIndex++) {
        var fragment = collection_1.ListWrapper.createFixedSize(fragmentsRootNodeCount[fragmentIndex]);
        fragments[fragmentIndex] = fragment;
        // Note: the 2nd, 3rd, ... fragments are separated by each other via a '|'
        if (fragmentIndex >= 1) {
            childNode = dom_adapter_1.DOM.nextSibling(childNode);
        }
        for (var i = 0; i < fragment.length; i++) {
            fragment[i] = childNode;
            childNode = dom_adapter_1.DOM.nextSibling(childNode);
        }
    }
    return fragments;
}
function queryBoundTextNodes(templateContent, rootTextNodeIndices, boundElements, elementBinders, boundTextNodeCount) {
    var boundTextNodes = collection_1.ListWrapper.createFixedSize(boundTextNodeCount);
    var textNodeIndex = 0;
    if (rootTextNodeIndices.length > 0) {
        var rootChildNodes = dom_adapter_1.DOM.childNodes(templateContent);
        for (var i = 0; i < rootTextNodeIndices.length; i++) {
            boundTextNodes[textNodeIndex++] = rootChildNodes[rootTextNodeIndices[i]];
        }
    }
    for (var i = 0; i < elementBinders.length; i++) {
        var binder = elementBinders[i];
        var element = boundElements[i];
        if (binder.textNodeIndices.length > 0) {
            var childNodes = dom_adapter_1.DOM.childNodes(element);
            for (var j = 0; j < binder.textNodeIndices.length; j++) {
                boundTextNodes[textNodeIndex++] = childNodes[binder.textNodeIndices[j]];
            }
        }
    }
    return boundTextNodes;
}
function isElementWithTag(node, elementName) {
    return dom_adapter_1.DOM.isElementNode(node) && dom_adapter_1.DOM.tagName(node).toLowerCase() == elementName.toLowerCase();
}
exports.isElementWithTag = isElementWithTag;
function queryBoundTextNodeIndices(parentNode, boundTextNodes, resultCallback) {
    var childNodes = dom_adapter_1.DOM.childNodes(parentNode);
    for (var j = 0; j < childNodes.length; j++) {
        var node = childNodes[j];
        if (boundTextNodes.has(node)) {
            resultCallback(node, j, boundTextNodes.get(node));
        }
    }
}
exports.queryBoundTextNodeIndices = queryBoundTextNodeIndices;
function prependAll(parentNode, nodes) {
    var lastInsertedNode = null;
    nodes.forEach(function (node) {
        if (lang_1.isBlank(lastInsertedNode)) {
            var firstChild = dom_adapter_1.DOM.firstChild(parentNode);
            if (lang_1.isPresent(firstChild)) {
                dom_adapter_1.DOM.insertBefore(firstChild, node);
            }
            else {
                dom_adapter_1.DOM.appendChild(parentNode, node);
            }
        }
        else {
            dom_adapter_1.DOM.insertAfter(lastInsertedNode, node);
        }
        lastInsertedNode = node;
    });
}
exports.prependAll = prependAll;
//# sourceMappingURL=util.js.map