'use strict';var lang_1 = require('angular2/src/facade/lang');
var PregenProtoChangeDetector = (function () {
    function PregenProtoChangeDetector() {
    }
    PregenProtoChangeDetector.isSupported = function () { return false; };
    PregenProtoChangeDetector.prototype.instantiate = function (dispatcher) {
        throw new lang_1.BaseException('Pregen change detection not supported in Js');
    };
    return PregenProtoChangeDetector;
})();
exports.PregenProtoChangeDetector = PregenProtoChangeDetector;
//# sourceMappingURL=pregen_proto_change_detector.js.map