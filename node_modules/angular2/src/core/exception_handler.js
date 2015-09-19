'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var _ArrayLogger = (function () {
    function _ArrayLogger() {
        this.res = [];
    }
    _ArrayLogger.prototype.log = function (s) { this.res.push(s); };
    _ArrayLogger.prototype.logGroup = function (s) { this.res.push(s); };
    _ArrayLogger.prototype.logGroupEnd = function () { };
    ;
    return _ArrayLogger;
})();
/**
 * Provides a hook for centralized exception handling.
 *
 * The default implementation of `ExceptionHandler` prints error messages to the `Console`. To
 * intercept error handling,
 * write a custom exception handler that replaces this default as appropriate for your app.
 *
 * # Example
 *
 * ```javascript
 *
 * class MyExceptionHandler implements ExceptionHandler {
 *   call(error, stackTrace = null, reason = null) {
 *     // do something with the exception
 *   }
 * }
 *
 * bootstrap(MyApp, [bind(ExceptionHandler).toClass(MyExceptionHandler)])
 *
 * ```
 */
var ExceptionHandler = (function () {
    function ExceptionHandler(logger, rethrowException) {
        if (rethrowException === void 0) { rethrowException = true; }
        this.logger = logger;
        this.rethrowException = rethrowException;
    }
    ExceptionHandler.exceptionToString = function (exception, stackTrace, reason) {
        if (stackTrace === void 0) { stackTrace = null; }
        if (reason === void 0) { reason = null; }
        var l = new _ArrayLogger();
        var e = new ExceptionHandler(l, false);
        e.call(exception, stackTrace, reason);
        return l.res.join("\n");
    };
    ExceptionHandler.prototype.call = function (exception, stackTrace, reason) {
        if (stackTrace === void 0) { stackTrace = null; }
        if (reason === void 0) { reason = null; }
        var originalException = this._findOriginalException(exception);
        var originalStack = this._findOriginalStack(exception);
        var context = this._findContext(exception);
        this.logger.logGroup("EXCEPTION: " + exception);
        if (lang_1.isPresent(stackTrace) && lang_1.isBlank(originalStack)) {
            this.logger.log("STACKTRACE:");
            this.logger.log(this._longStackTrace(stackTrace));
        }
        if (lang_1.isPresent(reason)) {
            this.logger.log("REASON: " + reason);
        }
        if (lang_1.isPresent(originalException)) {
            this.logger.log("ORIGINAL EXCEPTION: " + originalException);
        }
        if (lang_1.isPresent(originalStack)) {
            this.logger.log("ORIGINAL STACKTRACE:");
            this.logger.log(this._longStackTrace(originalStack));
        }
        if (lang_1.isPresent(context)) {
            this.logger.log("ERROR CONTEXT:");
            this.logger.log(context);
        }
        this.logger.logGroupEnd();
        // We rethrow exceptions, so operations like 'bootstrap' will result in an error
        // when an exception happens. If we do not rethrow, bootstrap will always succeed.
        if (this.rethrowException)
            throw exception;
    };
    ExceptionHandler.prototype._longStackTrace = function (stackTrace) {
        return collection_1.isListLikeIterable(stackTrace) ? stackTrace.join("\n\n-----async gap-----\n") :
            stackTrace.toString();
    };
    ExceptionHandler.prototype._findContext = function (exception) {
        try {
            if (!(exception instanceof lang_1.BaseException))
                return null;
            return lang_1.isPresent(exception.context) ? exception.context :
                this._findContext(exception.originalException);
        }
        catch (e) {
            // exception.context can throw an exception. if it happens, we ignore the context.
            return null;
        }
    };
    ExceptionHandler.prototype._findOriginalException = function (exception) {
        if (!(exception instanceof lang_1.BaseException))
            return null;
        var e = exception.originalException;
        while (e instanceof lang_1.BaseException && lang_1.isPresent(e.originalException)) {
            e = e.originalException;
        }
        return e;
    };
    ExceptionHandler.prototype._findOriginalStack = function (exception) {
        if (!(exception instanceof lang_1.BaseException))
            return null;
        var e = exception;
        var stack = exception.originalStack;
        while (e instanceof lang_1.BaseException && lang_1.isPresent(e.originalException)) {
            e = e.originalException;
            if (e instanceof lang_1.BaseException && lang_1.isPresent(e.originalException)) {
                stack = e.originalStack;
            }
        }
        return stack;
    };
    ExceptionHandler = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [Object, Boolean])
    ], ExceptionHandler);
    return ExceptionHandler;
})();
exports.ExceptionHandler = ExceptionHandler;
//# sourceMappingURL=exception_handler.js.map