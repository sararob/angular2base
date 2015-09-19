'use strict';var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var compile_element_1 = require('./compile_element');
var util_1 = require('../util');
/**
 * Splits views at `<template>` elements or elements with `template` attribute:
 * For `<template>` elements:
 * - moves the content into a new and disconnected `<template>` element
 *   that is marked as view root.
 *
 * For elements with a `template` attribute:
 * - replaces the element with an empty `<template>` element,
 *   parses the content of the `template` attribute and adds the information to that
 *   `<template>` element. Marks the elements as view root.
 *
 * Note: In both cases the root of the nested view is disconnected from its parent element.
 * This is needed for browsers that don't support the `<template>` element
 * as we want to do locate elements with bindings using `getElementsByClassName` later on,
 * which should not descend into the nested view.
 */
var ViewSplitter = (function () {
    function ViewSplitter(_parser) {
        this._parser = _parser;
    }
    ViewSplitter.prototype.processStyle = function (style) { return style; };
    ViewSplitter.prototype.processElement = function (parent, current, control) {
        var attrs = current.attrs();
        var templateBindings = attrs.get('template');
        var hasTemplateBinding = lang_1.isPresent(templateBindings);
        // look for template shortcuts such as *ng-if="condition" and treat them as template="if
        // condition"
        collection_1.MapWrapper.forEach(attrs, function (attrValue, attrName) {
            if (lang_1.StringWrapper.startsWith(attrName, '*')) {
                var key = lang_1.StringWrapper.substring(attrName, 1); // remove the star
                if (hasTemplateBinding) {
                    // 2nd template binding detected
                    throw new lang_1.BaseException("Only one template directive per element is allowed: " +
                        (templateBindings + " and " + key + " cannot be used simultaneously ") +
                        ("in " + current.elementDescription));
                }
                else {
                    templateBindings = (attrValue.length == 0) ? key : key + ' ' + attrValue;
                    hasTemplateBinding = true;
                }
            }
        });
        if (lang_1.isPresent(parent)) {
            if (dom_adapter_1.DOM.isTemplateElement(current.element)) {
                if (!current.isViewRoot) {
                    var viewRoot = new compile_element_1.CompileElement(dom_adapter_1.DOM.createTemplate(''));
                    viewRoot.inheritedProtoView = current.bindElement().bindNestedProtoView(viewRoot.element);
                    // viewRoot doesn't appear in the original template, so we associate
                    // the current element description to get a more meaningful message in case of error
                    viewRoot.elementDescription = current.elementDescription;
                    viewRoot.isViewRoot = true;
                    this._moveChildNodes(dom_adapter_1.DOM.content(current.element), dom_adapter_1.DOM.content(viewRoot.element));
                    control.addChild(viewRoot);
                }
            }
            if (hasTemplateBinding) {
                var anchor = new compile_element_1.CompileElement(dom_adapter_1.DOM.createTemplate(''));
                anchor.inheritedProtoView = current.inheritedProtoView;
                anchor.inheritedElementBinder = current.inheritedElementBinder;
                anchor.distanceToInheritedBinder = current.distanceToInheritedBinder;
                // newParent doesn't appear in the original template, so we associate
                // the current element description to get a more meaningful message in case of error
                anchor.elementDescription = current.elementDescription;
                var viewRoot = new compile_element_1.CompileElement(dom_adapter_1.DOM.createTemplate(''));
                viewRoot.inheritedProtoView = anchor.bindElement().bindNestedProtoView(viewRoot.element);
                // viewRoot doesn't appear in the original template, so we associate
                // the current element description to get a more meaningful message in case of error
                viewRoot.elementDescription = current.elementDescription;
                viewRoot.isViewRoot = true;
                current.inheritedProtoView = viewRoot.inheritedProtoView;
                current.inheritedElementBinder = null;
                current.distanceToInheritedBinder = 0;
                this._parseTemplateBindings(templateBindings, anchor);
                dom_adapter_1.DOM.insertBefore(current.element, anchor.element);
                control.addParent(anchor);
                dom_adapter_1.DOM.appendChild(dom_adapter_1.DOM.content(viewRoot.element), current.element);
                control.addParent(viewRoot);
            }
        }
    };
    ViewSplitter.prototype._moveChildNodes = function (source, target) {
        var next = dom_adapter_1.DOM.firstChild(source);
        while (lang_1.isPresent(next)) {
            dom_adapter_1.DOM.appendChild(target, next);
            next = dom_adapter_1.DOM.firstChild(source);
        }
    };
    ViewSplitter.prototype._parseTemplateBindings = function (templateBindings, compileElement) {
        var bindings = this._parser.parseTemplateBindings(templateBindings, compileElement.elementDescription);
        for (var i = 0; i < bindings.length; i++) {
            var binding = bindings[i];
            if (binding.keyIsVar) {
                compileElement.bindElement().bindVariable(util_1.dashCaseToCamelCase(binding.key), binding.name);
                compileElement.attrs().set(binding.key, binding.name);
            }
            else if (lang_1.isPresent(binding.expression)) {
                compileElement.bindElement().bindProperty(util_1.dashCaseToCamelCase(binding.key), binding.expression);
                compileElement.attrs().set(binding.key, binding.expression.source);
            }
            else {
                dom_adapter_1.DOM.setAttribute(compileElement.element, binding.key, '');
            }
        }
    };
    return ViewSplitter;
})();
exports.ViewSplitter = ViewSplitter;
//# sourceMappingURL=view_splitter.js.map