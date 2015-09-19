'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var property_binding_parser_1 = require('./property_binding_parser');
var text_interpolation_parser_1 = require('./text_interpolation_parser');
var directive_parser_1 = require('./directive_parser');
var view_splitter_1 = require('./view_splitter');
var style_encapsulator_1 = require('./style_encapsulator');
var CompileStepFactory = (function () {
    function CompileStepFactory() {
    }
    CompileStepFactory.prototype.createSteps = function (view) { return null; };
    return CompileStepFactory;
})();
exports.CompileStepFactory = CompileStepFactory;
var DefaultStepFactory = (function (_super) {
    __extends(DefaultStepFactory, _super);
    function DefaultStepFactory(_parser, _appId) {
        _super.call(this);
        this._parser = _parser;
        this._appId = _appId;
        this._componentUIDsCache = new Map();
    }
    DefaultStepFactory.prototype.createSteps = function (view) {
        return [
            new view_splitter_1.ViewSplitter(this._parser),
            new property_binding_parser_1.PropertyBindingParser(this._parser),
            new directive_parser_1.DirectiveParser(this._parser, view.directives),
            new text_interpolation_parser_1.TextInterpolationParser(this._parser),
            new style_encapsulator_1.StyleEncapsulator(this._appId, view, this._componentUIDsCache)
        ];
    };
    return DefaultStepFactory;
})(CompileStepFactory);
exports.DefaultStepFactory = DefaultStepFactory;
//# sourceMappingURL=compile_step_factory.js.map