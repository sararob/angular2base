'use strict';var lang_1 = require("angular2/src/facade/lang");
var di_1 = require("angular2/di");
exports.ON_WEB_WORKER = lang_1.CONST_EXPR(new di_1.OpaqueToken('WebWorker.onWebWorker'));
var WebWorkerElementRef = (function () {
    function WebWorkerElementRef(renderView, renderBoundElementIndex) {
        this.renderView = renderView;
        this.renderBoundElementIndex = renderBoundElementIndex;
    }
    return WebWorkerElementRef;
})();
exports.WebWorkerElementRef = WebWorkerElementRef;
//# sourceMappingURL=api.js.map