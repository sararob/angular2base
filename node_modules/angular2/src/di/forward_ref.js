'use strict';var lang_1 = require('angular2/src/facade/lang');
/**
 * Allows to refer to references which are not yet defined.
 *
 * This situation arises when the key which we need te refer to for the purposes of DI is declared,
 * but not yet defined.
 *
 * ## Example:
 *
 * ```
 * class Door {
 *   // Incorrect way to refer to a reference which is defined later.
 *   // This fails because `Lock` is undefined at this point.
 *   constructor(lock:Lock) { }
 *
 *   // Correct way to refer to a reference which is defined later.
 *   // The reference needs to be captured in a closure.
 *   constructor(@Inject(forwardRef(() => Lock)) lock:Lock) { }
 * }
 *
 * // Only at this point the lock is defined.
 * class Lock {
 * }
 * ```
 */
function forwardRef(forwardRefFn) {
    forwardRefFn.__forward_ref__ = forwardRef;
    forwardRefFn.toString = function () { return lang_1.stringify(this()); };
    return forwardRefFn;
}
exports.forwardRef = forwardRef;
/**
 * Lazily retrieve the reference value.
 *
 * See: {@link forwardRef}
 */
function resolveForwardRef(type) {
    if (lang_1.isFunction(type) && type.hasOwnProperty('__forward_ref__') &&
        type.__forward_ref__ === forwardRef) {
        return type();
    }
    else {
        return type;
    }
}
exports.resolveForwardRef = resolveForwardRef;
//# sourceMappingURL=forward_ref.js.map