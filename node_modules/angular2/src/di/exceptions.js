'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
function findFirstClosedCycle(keys) {
    var res = [];
    for (var i = 0; i < keys.length; ++i) {
        if (collection_1.ListWrapper.contains(res, keys[i])) {
            res.push(keys[i]);
            return res;
        }
        else {
            res.push(keys[i]);
        }
    }
    return res;
}
function constructResolvingPath(keys) {
    if (keys.length > 1) {
        var reversed = findFirstClosedCycle(collection_1.ListWrapper.reversed(keys));
        var tokenStrs = collection_1.ListWrapper.map(reversed, function (k) { return lang_1.stringify(k.token); });
        return " (" + tokenStrs.join(' -> ') + ")";
    }
    else {
        return "";
    }
}
/**
 * Base class for all errors arising from misconfigured bindings.
 */
var AbstractBindingError = (function (_super) {
    __extends(AbstractBindingError, _super);
    function AbstractBindingError(injector, key, constructResolvingMessage, originalException, originalStack) {
        _super.call(this, "DI Exception", originalException, originalStack, null);
        this.keys = [key];
        this.injectors = [injector];
        this.constructResolvingMessage = constructResolvingMessage;
        this.message = this.constructResolvingMessage(this.keys);
    }
    AbstractBindingError.prototype.addKey = function (injector, key) {
        this.injectors.push(injector);
        this.keys.push(key);
        this.message = this.constructResolvingMessage(this.keys);
    };
    Object.defineProperty(AbstractBindingError.prototype, "context", {
        get: function () { return this.injectors[this.injectors.length - 1].debugContext(); },
        enumerable: true,
        configurable: true
    });
    AbstractBindingError.prototype.toString = function () { return this.message; };
    return AbstractBindingError;
})(lang_1.BaseException);
exports.AbstractBindingError = AbstractBindingError;
/**
 * Thrown when trying to retrieve a dependency by `Key` from {@link Injector}, but the
 * {@link Injector} does not have a {@link Binding} for {@link Key}.
 */
var NoBindingError = (function (_super) {
    __extends(NoBindingError, _super);
    function NoBindingError(injector, key) {
        _super.call(this, injector, key, function (keys) {
            var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
            return "No provider for " + first + "!" + constructResolvingPath(keys);
        });
    }
    return NoBindingError;
})(AbstractBindingError);
exports.NoBindingError = NoBindingError;
/**
 * Thrown when dependencies form a cycle.
 *
 * ## Example:
 *
 * ```javascript
 * class A {
 *   constructor(b:B) {}
 * }
 * class B {
 *   constructor(a:A) {}
 * }
 * ```
 *
 * Retrieving `A` or `B` throws a `CyclicDependencyError` as the graph above cannot be constructed.
 */
var CyclicDependencyError = (function (_super) {
    __extends(CyclicDependencyError, _super);
    function CyclicDependencyError(injector, key) {
        _super.call(this, injector, key, function (keys) {
            return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
        });
    }
    return CyclicDependencyError;
})(AbstractBindingError);
exports.CyclicDependencyError = CyclicDependencyError;
/**
 * Thrown when a constructing type returns with an Error.
 *
 * The `InstantiationError` class contains the original error plus the dependency graph which caused
 * this object to be instantiated.
 */
var InstantiationError = (function (_super) {
    __extends(InstantiationError, _super);
    function InstantiationError(injector, originalException, originalStack, key) {
        _super.call(this, injector, key, function (keys) {
            var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
            return "Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ".";
        }, originalException, originalStack);
        this.causeKey = key;
    }
    return InstantiationError;
})(AbstractBindingError);
exports.InstantiationError = InstantiationError;
/**
 * Thrown when an object other then {@link Binding} (or `Type`) is passed to {@link Injector}
 * creation.
 */
var InvalidBindingError = (function (_super) {
    __extends(InvalidBindingError, _super);
    function InvalidBindingError(binding) {
        _super.call(this);
        this.message = "Invalid binding - only instances of Binding and Type are allowed, got: " +
            binding.toString();
    }
    InvalidBindingError.prototype.toString = function () { return this.message; };
    return InvalidBindingError;
})(lang_1.BaseException);
exports.InvalidBindingError = InvalidBindingError;
/**
 * Thrown when the class has no annotation information.
 *
 * Lack of annotation information prevents the {@link Injector} from determining which dependencies
 * need to be injected into the constructor.
 */
var NoAnnotationError = (function (_super) {
    __extends(NoAnnotationError, _super);
    function NoAnnotationError(typeOrFunc, params) {
        _super.call(this);
        var signature = [];
        for (var i = 0, ii = params.length; i < ii; i++) {
            var parameter = params[i];
            if (lang_1.isBlank(parameter) || parameter.length == 0) {
                signature.push('?');
            }
            else {
                signature.push(collection_1.ListWrapper.map(parameter, lang_1.stringify).join(' '));
            }
        }
        this.message = "Cannot resolve all parameters for " + lang_1.stringify(typeOrFunc) + "(" +
            signature.join(', ') + "). " +
            'Make sure they all have valid type or annotations.';
    }
    NoAnnotationError.prototype.toString = function () { return this.message; };
    return NoAnnotationError;
})(lang_1.BaseException);
exports.NoAnnotationError = NoAnnotationError;
/**
 * Thrown when getting an object by index.
 */
var OutOfBoundsError = (function (_super) {
    __extends(OutOfBoundsError, _super);
    function OutOfBoundsError(index) {
        _super.call(this);
        this.message = "Index " + index + " is out-of-bounds.";
    }
    OutOfBoundsError.prototype.toString = function () { return this.message; };
    return OutOfBoundsError;
})(lang_1.BaseException);
exports.OutOfBoundsError = OutOfBoundsError;
//# sourceMappingURL=exceptions.js.map