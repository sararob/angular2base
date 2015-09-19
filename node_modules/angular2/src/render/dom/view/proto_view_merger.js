'use strict';var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var proto_view_1 = require('./proto_view');
var element_binder_1 = require('./element_binder');
var api_1 = require('../../api');
var util_1 = require('../util');
function mergeProtoViewsRecursively(templateCloner, protoViewRefs) {
    // clone
    var clonedProtoViews = [];
    var hostViewAndBinderIndices = [];
    cloneProtoViews(templateCloner, protoViewRefs, clonedProtoViews, hostViewAndBinderIndices);
    var mainProtoView = clonedProtoViews[0];
    // modify the DOM
    mergeEmbeddedPvsIntoComponentOrRootPv(clonedProtoViews, hostViewAndBinderIndices);
    var fragments = [];
    var elementsWithNativeShadowRoot = new Set();
    mergeComponents(clonedProtoViews, hostViewAndBinderIndices, fragments, elementsWithNativeShadowRoot);
    // Note: Need to remark parent elements of bound text nodes
    // so that we can find them later via queryBoundElements!
    markBoundTextNodeParentsAsBoundElements(clonedProtoViews);
    // create a new root element with the changed fragments and elements
    var fragmentsRootNodeCount = fragments.map(function (fragment) { return fragment.length; });
    var rootElement = createRootElementFromFragments(fragments);
    var rootNode = dom_adapter_1.DOM.content(rootElement);
    // read out the new element / text node / ElementBinder order
    var mergedBoundElements = util_1.queryBoundElements(rootNode, false);
    var mergedBoundTextIndices = new Map();
    var boundTextNodeMap = indexBoundTextNodes(clonedProtoViews);
    var rootTextNodeIndices = calcRootTextNodeIndices(rootNode, boundTextNodeMap, mergedBoundTextIndices);
    var mergedElementBinders = calcElementBinders(clonedProtoViews, mergedBoundElements, elementsWithNativeShadowRoot, boundTextNodeMap, mergedBoundTextIndices);
    // create element / text index mappings
    var mappedElementIndices = calcMappedElementIndices(clonedProtoViews, mergedBoundElements);
    var mappedTextIndices = calcMappedTextIndices(clonedProtoViews, mergedBoundTextIndices);
    // create result
    var hostElementIndicesByViewIndex = calcHostElementIndicesByViewIndex(clonedProtoViews, hostViewAndBinderIndices);
    var nestedViewCounts = calcNestedViewCounts(hostViewAndBinderIndices);
    var mergedProtoView = proto_view_1.DomProtoView.create(templateCloner, mainProtoView.original.type, rootElement, mainProtoView.original.encapsulation, fragmentsRootNodeCount, rootTextNodeIndices, mergedElementBinders, new Map());
    return new api_1.RenderProtoViewMergeMapping(new proto_view_1.DomProtoViewRef(mergedProtoView), fragmentsRootNodeCount.length, mappedElementIndices, mergedBoundElements.length, mappedTextIndices, hostElementIndicesByViewIndex, nestedViewCounts);
}
exports.mergeProtoViewsRecursively = mergeProtoViewsRecursively;
function cloneProtoViews(templateCloner, protoViewRefs, targetClonedProtoViews, targetHostViewAndBinderIndices) {
    var hostProtoView = proto_view_1.resolveInternalDomProtoView(protoViewRefs[0]);
    var hostPvIdx = targetClonedProtoViews.length;
    targetClonedProtoViews.push(util_1.cloneAndQueryProtoView(templateCloner, hostProtoView, false));
    if (targetHostViewAndBinderIndices.length === 0) {
        targetHostViewAndBinderIndices.push([null, null]);
    }
    var protoViewIdx = 1;
    for (var i = 0; i < hostProtoView.elementBinders.length; i++) {
        var binder = hostProtoView.elementBinders[i];
        if (binder.hasNestedProtoView) {
            var nestedEntry = protoViewRefs[protoViewIdx++];
            if (lang_1.isPresent(nestedEntry)) {
                targetHostViewAndBinderIndices.push([hostPvIdx, i]);
                if (lang_1.isArray(nestedEntry)) {
                    cloneProtoViews(templateCloner, nestedEntry, targetClonedProtoViews, targetHostViewAndBinderIndices);
                }
                else {
                    targetClonedProtoViews.push(util_1.cloneAndQueryProtoView(templateCloner, proto_view_1.resolveInternalDomProtoView(nestedEntry), false));
                }
            }
        }
    }
}
function markBoundTextNodeParentsAsBoundElements(mergableProtoViews) {
    mergableProtoViews.forEach(function (mergableProtoView) {
        mergableProtoView.boundTextNodes.forEach(function (textNode) {
            var parentNode = textNode.parentNode;
            if (lang_1.isPresent(parentNode) && dom_adapter_1.DOM.isElementNode(parentNode)) {
                dom_adapter_1.DOM.addClass(parentNode, util_1.NG_BINDING_CLASS);
            }
        });
    });
}
function indexBoundTextNodes(mergableProtoViews) {
    var boundTextNodeMap = new Map();
    for (var pvIndex = 0; pvIndex < mergableProtoViews.length; pvIndex++) {
        var mergableProtoView = mergableProtoViews[pvIndex];
        mergableProtoView.boundTextNodes.forEach(function (textNode) { boundTextNodeMap.set(textNode, null); });
    }
    return boundTextNodeMap;
}
function mergeEmbeddedPvsIntoComponentOrRootPv(clonedProtoViews, hostViewAndBinderIndices) {
    var nearestHostComponentOrRootPvIndices = calcNearestHostComponentOrRootPvIndices(clonedProtoViews, hostViewAndBinderIndices);
    for (var viewIdx = 1; viewIdx < clonedProtoViews.length; viewIdx++) {
        var clonedProtoView = clonedProtoViews[viewIdx];
        if (clonedProtoView.original.type === api_1.ViewType.EMBEDDED) {
            var hostComponentIdx = nearestHostComponentOrRootPvIndices[viewIdx];
            var hostPv = clonedProtoViews[hostComponentIdx];
            clonedProtoView.fragments.forEach(function (fragment) { return hostPv.fragments.push(fragment); });
        }
    }
}
function calcNearestHostComponentOrRootPvIndices(clonedProtoViews, hostViewAndBinderIndices) {
    var nearestHostComponentOrRootPvIndices = collection_1.ListWrapper.createFixedSize(clonedProtoViews.length);
    nearestHostComponentOrRootPvIndices[0] = null;
    for (var viewIdx = 1; viewIdx < hostViewAndBinderIndices.length; viewIdx++) {
        var hostViewIdx = hostViewAndBinderIndices[viewIdx][0];
        var hostProtoView = clonedProtoViews[hostViewIdx];
        if (hostViewIdx === 0 || hostProtoView.original.type === api_1.ViewType.COMPONENT) {
            nearestHostComponentOrRootPvIndices[viewIdx] = hostViewIdx;
        }
        else {
            nearestHostComponentOrRootPvIndices[viewIdx] =
                nearestHostComponentOrRootPvIndices[hostViewIdx];
        }
    }
    return nearestHostComponentOrRootPvIndices;
}
function mergeComponents(clonedProtoViews, hostViewAndBinderIndices, targetFragments, targetElementsWithNativeShadowRoot) {
    var hostProtoView = clonedProtoViews[0];
    hostProtoView.fragments.forEach(function (fragment) { return targetFragments.push(fragment); });
    for (var viewIdx = 1; viewIdx < clonedProtoViews.length; viewIdx++) {
        var hostViewIdx = hostViewAndBinderIndices[viewIdx][0];
        var hostBinderIdx = hostViewAndBinderIndices[viewIdx][1];
        var hostProtoView = clonedProtoViews[hostViewIdx];
        var clonedProtoView = clonedProtoViews[viewIdx];
        if (clonedProtoView.original.type === api_1.ViewType.COMPONENT) {
            mergeComponent(hostProtoView, hostBinderIdx, clonedProtoView, targetFragments, targetElementsWithNativeShadowRoot);
        }
    }
}
function mergeComponent(hostProtoView, binderIdx, nestedProtoView, targetFragments, targetElementsWithNativeShadowRoot) {
    var hostElement = hostProtoView.boundElements[binderIdx];
    // We wrap the fragments into elements so that we can expand <ng-content>
    // even for root nodes in the fragment without special casing them.
    var fragmentElements = mapFragmentsIntoElements(nestedProtoView.fragments);
    var contentElements = findContentElements(fragmentElements);
    var projectableNodes = dom_adapter_1.DOM.childNodesAsList(hostElement);
    for (var i = 0; i < contentElements.length; i++) {
        var contentElement = contentElements[i];
        var select = dom_adapter_1.DOM.getAttribute(contentElement, 'select');
        projectableNodes = projectMatchingNodes(select, contentElement, projectableNodes);
    }
    // unwrap the fragment elements into arrays of nodes after projecting
    var fragments = extractFragmentNodesFromElements(fragmentElements);
    var useNativeShadowRoot = nestedProtoView.original.encapsulation === api_1.ViewEncapsulation.NATIVE;
    if (useNativeShadowRoot) {
        targetElementsWithNativeShadowRoot.add(hostElement);
    }
    collection_1.MapWrapper.forEach(nestedProtoView.original.hostAttributes, function (attrValue, attrName) {
        dom_adapter_1.DOM.setAttribute(hostElement, attrName, attrValue);
    });
    appendComponentNodesToHost(hostProtoView, binderIdx, fragments[0], useNativeShadowRoot);
    for (var i = 1; i < fragments.length; i++) {
        targetFragments.push(fragments[i]);
    }
}
function mapFragmentsIntoElements(fragments) {
    return fragments.map(function (fragment) {
        var fragmentElement = dom_adapter_1.DOM.createTemplate('');
        fragment.forEach(function (node) { return dom_adapter_1.DOM.appendChild(dom_adapter_1.DOM.content(fragmentElement), node); });
        return fragmentElement;
    });
}
function extractFragmentNodesFromElements(fragmentElements) {
    return fragmentElements.map(function (fragmentElement) { return dom_adapter_1.DOM.childNodesAsList(dom_adapter_1.DOM.content(fragmentElement)); });
}
function findContentElements(fragmentElements) {
    var contentElements = [];
    fragmentElements.forEach(function (fragmentElement) {
        var fragmentContentElements = dom_adapter_1.DOM.querySelectorAll(dom_adapter_1.DOM.content(fragmentElement), util_1.NG_CONTENT_ELEMENT_NAME);
        for (var i = 0; i < fragmentContentElements.length; i++) {
            contentElements.push(fragmentContentElements[i]);
        }
    });
    return sortContentElements(contentElements);
}
function appendComponentNodesToHost(hostProtoView, binderIdx, componentRootNodes, useNativeShadowRoot) {
    var hostElement = hostProtoView.boundElements[binderIdx];
    if (useNativeShadowRoot) {
        var shadowRootWrapper = dom_adapter_1.DOM.createElement(util_1.NG_SHADOW_ROOT_ELEMENT_NAME);
        for (var i = 0; i < componentRootNodes.length; i++) {
            dom_adapter_1.DOM.appendChild(shadowRootWrapper, componentRootNodes[i]);
        }
        var firstChild = dom_adapter_1.DOM.firstChild(hostElement);
        if (lang_1.isPresent(firstChild)) {
            dom_adapter_1.DOM.insertBefore(firstChild, shadowRootWrapper);
        }
        else {
            dom_adapter_1.DOM.appendChild(hostElement, shadowRootWrapper);
        }
    }
    else {
        dom_adapter_1.DOM.clearNodes(hostElement);
        for (var i = 0; i < componentRootNodes.length; i++) {
            dom_adapter_1.DOM.appendChild(hostElement, componentRootNodes[i]);
        }
    }
}
function projectMatchingNodes(selector, contentElement, nodes) {
    var remaining = [];
    dom_adapter_1.DOM.insertBefore(contentElement, dom_adapter_1.DOM.createComment('['));
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var matches = false;
        if (isWildcard(selector)) {
            matches = true;
        }
        else if (dom_adapter_1.DOM.isElementNode(node) && dom_adapter_1.DOM.elementMatches(node, selector)) {
            matches = true;
        }
        if (matches) {
            dom_adapter_1.DOM.insertBefore(contentElement, node);
        }
        else {
            remaining.push(node);
        }
    }
    dom_adapter_1.DOM.insertBefore(contentElement, dom_adapter_1.DOM.createComment(']'));
    dom_adapter_1.DOM.remove(contentElement);
    return remaining;
}
function isWildcard(selector) {
    return lang_1.isBlank(selector) || selector.length === 0 || selector == '*';
}
// we need to sort content elements as they can originate from
// different sub views
function sortContentElements(contentElements) {
    // for now, only move the wildcard selector to the end.
    // TODO(tbosch): think about sorting by selector specifity...
    var firstWildcard = null;
    var sorted = [];
    contentElements.forEach(function (contentElement) {
        var select = dom_adapter_1.DOM.getAttribute(contentElement, 'select');
        if (isWildcard(select)) {
            if (lang_1.isBlank(firstWildcard)) {
                firstWildcard = contentElement;
            }
        }
        else {
            sorted.push(contentElement);
        }
    });
    if (lang_1.isPresent(firstWildcard)) {
        sorted.push(firstWildcard);
    }
    return sorted;
}
function createRootElementFromFragments(fragments) {
    var rootElement = dom_adapter_1.DOM.createTemplate('');
    var rootNode = dom_adapter_1.DOM.content(rootElement);
    for (var i = 0; i < fragments.length; i++) {
        var fragment = fragments[i];
        if (i >= 1) {
            // Note: We need to seprate fragments by a comment so that sibling
            // text nodes don't get merged when we serialize the DomProtoView into a string
            // and parse it back again.
            dom_adapter_1.DOM.appendChild(rootNode, dom_adapter_1.DOM.createComment('|'));
        }
        fragment.forEach(function (node) { dom_adapter_1.DOM.appendChild(rootNode, node); });
    }
    return rootElement;
}
function calcRootTextNodeIndices(rootNode, boundTextNodes, targetBoundTextIndices) {
    var rootTextNodeIndices = [];
    util_1.queryBoundTextNodeIndices(rootNode, boundTextNodes, function (textNode, nodeIndex, _) {
        rootTextNodeIndices.push(nodeIndex);
        targetBoundTextIndices.set(textNode, targetBoundTextIndices.size);
    });
    return rootTextNodeIndices;
}
function calcElementBinders(clonedProtoViews, mergedBoundElements, elementsWithNativeShadowRoot, boundTextNodes, targetBoundTextIndices) {
    var elementBinderByElement = indexElementBindersByElement(clonedProtoViews);
    var mergedElementBinders = [];
    for (var i = 0; i < mergedBoundElements.length; i++) {
        var element = mergedBoundElements[i];
        var textNodeIndices = [];
        util_1.queryBoundTextNodeIndices(element, boundTextNodes, function (textNode, nodeIndex, _) {
            textNodeIndices.push(nodeIndex);
            targetBoundTextIndices.set(textNode, targetBoundTextIndices.size);
        });
        mergedElementBinders.push(updateElementBinders(elementBinderByElement.get(element), textNodeIndices, collection_1.SetWrapper.has(elementsWithNativeShadowRoot, element)));
    }
    return mergedElementBinders;
}
function indexElementBindersByElement(mergableProtoViews) {
    var elementBinderByElement = new Map();
    mergableProtoViews.forEach(function (mergableProtoView) {
        for (var i = 0; i < mergableProtoView.boundElements.length; i++) {
            var el = mergableProtoView.boundElements[i];
            if (lang_1.isPresent(el)) {
                elementBinderByElement.set(el, mergableProtoView.original.elementBinders[i]);
            }
        }
    });
    return elementBinderByElement;
}
function updateElementBinders(elementBinder, textNodeIndices, hasNativeShadowRoot) {
    var result;
    if (lang_1.isBlank(elementBinder)) {
        result = new element_binder_1.DomElementBinder({
            textNodeIndices: textNodeIndices,
            hasNestedProtoView: false,
            eventLocals: null,
            localEvents: [],
            globalEvents: [],
            hasNativeShadowRoot: false
        });
    }
    else {
        result = new element_binder_1.DomElementBinder({
            textNodeIndices: textNodeIndices,
            hasNestedProtoView: false,
            eventLocals: elementBinder.eventLocals,
            localEvents: elementBinder.localEvents,
            globalEvents: elementBinder.globalEvents,
            hasNativeShadowRoot: hasNativeShadowRoot
        });
    }
    return result;
}
function calcMappedElementIndices(clonedProtoViews, mergedBoundElements) {
    var mergedBoundElementIndices = indexArray(mergedBoundElements);
    var mappedElementIndices = [];
    clonedProtoViews.forEach(function (clonedProtoView) {
        clonedProtoView.boundElements.forEach(function (boundElement) {
            var mappedElementIndex = mergedBoundElementIndices.get(boundElement);
            mappedElementIndices.push(mappedElementIndex);
        });
    });
    return mappedElementIndices;
}
function calcMappedTextIndices(clonedProtoViews, mergedBoundTextIndices) {
    var mappedTextIndices = [];
    clonedProtoViews.forEach(function (clonedProtoView) {
        clonedProtoView.boundTextNodes.forEach(function (textNode) {
            var mappedTextIndex = mergedBoundTextIndices.get(textNode);
            mappedTextIndices.push(mappedTextIndex);
        });
    });
    return mappedTextIndices;
}
function calcHostElementIndicesByViewIndex(clonedProtoViews, hostViewAndBinderIndices) {
    var hostElementIndices = [null];
    var viewElementOffsets = [0];
    var elementIndex = clonedProtoViews[0].original.elementBinders.length;
    for (var viewIdx = 1; viewIdx < hostViewAndBinderIndices.length; viewIdx++) {
        viewElementOffsets.push(elementIndex);
        elementIndex += clonedProtoViews[viewIdx].original.elementBinders.length;
        var hostViewIdx = hostViewAndBinderIndices[viewIdx][0];
        var hostBinderIdx = hostViewAndBinderIndices[viewIdx][1];
        hostElementIndices.push(viewElementOffsets[hostViewIdx] + hostBinderIdx);
    }
    return hostElementIndices;
}
function calcNestedViewCounts(hostViewAndBinderIndices) {
    var nestedViewCounts = collection_1.ListWrapper.createFixedSize(hostViewAndBinderIndices.length);
    collection_1.ListWrapper.fill(nestedViewCounts, 0);
    for (var viewIdx = hostViewAndBinderIndices.length - 1; viewIdx >= 1; viewIdx--) {
        var hostViewAndElementIdx = hostViewAndBinderIndices[viewIdx];
        if (lang_1.isPresent(hostViewAndElementIdx)) {
            nestedViewCounts[hostViewAndElementIdx[0]] += nestedViewCounts[viewIdx] + 1;
        }
    }
    return nestedViewCounts;
}
function indexArray(arr) {
    var map = new Map();
    for (var i = 0; i < arr.length; i++) {
        map.set(arr[i], i);
    }
    return map;
}
//# sourceMappingURL=proto_view_merger.js.map