'use strict';function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
/**
 * Contains everything you need to bootstrap your application.
 */
var application_1 = require('angular2/src/core/application');
exports.bootstrap = application_1.bootstrap;
// TODO(someone familiar with systemjs): the exports below are copied from
// angular2_exports.ts. Re-exporting from angular2_exports.ts causes systemjs
// to resolve imports very very very slowly. See also a similar notice in
// angular2.ts
__export(require('./metadata'));
__export(require('./change_detection'));
__export(require('./core'));
__export(require('./di'));
__export(require('./directives'));
__export(require('./forms'));
__export(require('./render'));
//# sourceMappingURL=bootstrap.js.map