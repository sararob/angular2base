'use strict';var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var compile_element_1 = require('./compile_element');
var compile_control_1 = require('./compile_control');
var proto_view_builder_1 = require('../view/proto_view_builder');
/**
 * CompilePipeline for executing CompileSteps recursively for
 * all elements in a template.
 */
var CompilePipeline = (function () {
    function CompilePipeline(steps) {
        this.steps = steps;
        this._control = new compile_control_1.CompileControl(steps);
    }
    CompilePipeline.prototype.processStyles = function (styles) {
        var _this = this;
        return styles.map(function (style) {
            _this.steps.forEach(function (step) { style = step.processStyle(style); });
            return style;
        });
    };
    CompilePipeline.prototype.processElements = function (rootElement, protoViewType, viewDef) {
        var results = [];
        var compilationCtxtDescription = viewDef.componentId;
        var rootCompileElement = new compile_element_1.CompileElement(rootElement, compilationCtxtDescription);
        rootCompileElement.inheritedProtoView =
            new proto_view_builder_1.ProtoViewBuilder(rootElement, protoViewType, viewDef.encapsulation);
        rootCompileElement.isViewRoot = true;
        this._processElement(results, null, rootCompileElement, compilationCtxtDescription);
        return results;
    };
    CompilePipeline.prototype._processElement = function (results, parent, current, compilationCtxtDescription) {
        if (compilationCtxtDescription === void 0) { compilationCtxtDescription = ''; }
        var additionalChildren = this._control.internalProcess(results, 0, parent, current);
        if (current.compileChildren) {
            var node = dom_adapter_1.DOM.firstChild(dom_adapter_1.DOM.templateAwareRoot(current.element));
            while (lang_1.isPresent(node)) {
                // compiliation can potentially move the node, so we need to store the
                // next sibling before recursing.
                var nextNode = dom_adapter_1.DOM.nextSibling(node);
                if (dom_adapter_1.DOM.isElementNode(node)) {
                    var childCompileElement = new compile_element_1.CompileElement(node, compilationCtxtDescription);
                    childCompileElement.inheritedProtoView = current.inheritedProtoView;
                    childCompileElement.inheritedElementBinder = current.inheritedElementBinder;
                    childCompileElement.distanceToInheritedBinder = current.distanceToInheritedBinder + 1;
                    this._processElement(results, current, childCompileElement);
                }
                node = nextNode;
            }
        }
        if (lang_1.isPresent(additionalChildren)) {
            for (var i = 0; i < additionalChildren.length; i++) {
                this._processElement(results, current, additionalChildren[i]);
            }
        }
    };
    return CompilePipeline;
})();
exports.CompilePipeline = CompilePipeline;
//# sourceMappingURL=compile_pipeline.js.map