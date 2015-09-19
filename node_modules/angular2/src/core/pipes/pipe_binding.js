'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var di_1 = require('angular2/di');
var PipeBinding = (function (_super) {
    __extends(PipeBinding, _super);
    function PipeBinding(name, key, factory, dependencies) {
        _super.call(this, key, factory, dependencies);
        this.name = name;
    }
    PipeBinding.createFromType = function (type, metadata) {
        var binding = new di_1.Binding(type, { toClass: type });
        var rb = binding.resolve();
        return new PipeBinding(metadata.name, rb.key, rb.factory, rb.dependencies);
    };
    return PipeBinding;
})(di_1.ResolvedBinding);
exports.PipeBinding = PipeBinding;
//# sourceMappingURL=pipe_binding.js.map