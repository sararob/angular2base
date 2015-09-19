'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var api_1 = require('../../api');
function resolveInternalDomFragment(fragmentRef) {
    return fragmentRef._nodes;
}
exports.resolveInternalDomFragment = resolveInternalDomFragment;
var DomFragmentRef = (function (_super) {
    __extends(DomFragmentRef, _super);
    function DomFragmentRef(_nodes) {
        _super.call(this);
        this._nodes = _nodes;
    }
    return DomFragmentRef;
})(api_1.RenderFragmentRef);
exports.DomFragmentRef = DomFragmentRef;
//# sourceMappingURL=fragment.js.map