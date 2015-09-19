'use strict';var lang_1 = require('angular2/src/facade/lang');
function _abstract() {
    return new lang_1.BaseException('This method is abstract');
}
var LocationStrategy = (function () {
    function LocationStrategy() {
    }
    LocationStrategy.prototype.path = function () { throw _abstract(); };
    LocationStrategy.prototype.pushState = function (ctx, title, url) { throw _abstract(); };
    LocationStrategy.prototype.forward = function () { throw _abstract(); };
    LocationStrategy.prototype.back = function () { throw _abstract(); };
    LocationStrategy.prototype.onPopState = function (fn) { throw _abstract(); };
    LocationStrategy.prototype.getBaseHref = function () { throw _abstract(); };
    return LocationStrategy;
})();
exports.LocationStrategy = LocationStrategy;
//# sourceMappingURL=location_strategy.js.map