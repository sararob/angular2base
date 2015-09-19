'use strict';var ng = require('./angular2');
// the router should have its own SFX bundle
// But currently the module arithemtic 'angular2/router_sfx - angular2/angular2',
// is not support by system builder.
var router = require('./router');
var _prevNg = window.ng;
window.ng = ng;
window.ngRouter = router;
/**
 * Calling noConflict will restore window.angular to its pre-angular loading state
 * and return the angular module object.
 */
ng.noConflict = function () {
    window.ng = _prevNg;
    return ng;
};
//# sourceMappingURL=angular2_sfx.js.map