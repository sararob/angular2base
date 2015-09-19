'use strict';/**
 * The `angular2` is the single place to import all of the individual types.
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// TODO(someone familiar with systemjs): the exports below are copied from
// angular2_exports.ts. Re-exporting from angular2_exports.ts causes systemjs
// to resolve imports very very very slowly. See also a similar notice in
// bootstrap.ts
__export(require('./metadata'));
__export(require('./change_detection'));
__export(require('./core'));
__export(require('./di'));
__export(require('./directives'));
__export(require('./forms'));
__export(require('./render'));
__export(require('./profile'));
//# sourceMappingURL=angular2.js.map