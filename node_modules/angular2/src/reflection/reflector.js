'use strict';var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var ReflectionInfo = (function () {
    function ReflectionInfo(annotations, parameters, factory, interfaces) {
        this._annotations = annotations;
        this._parameters = parameters;
        this._factory = factory;
        this._interfaces = interfaces;
    }
    return ReflectionInfo;
})();
exports.ReflectionInfo = ReflectionInfo;
var Reflector = (function () {
    function Reflector(reflectionCapabilities) {
        this._injectableInfo = new collection_1.Map();
        this._getters = new collection_1.Map();
        this._setters = new collection_1.Map();
        this._methods = new collection_1.Map();
        this.reflectionCapabilities = reflectionCapabilities;
    }
    Reflector.prototype.isReflectionEnabled = function () { return this.reflectionCapabilities.isReflectionEnabled(); };
    Reflector.prototype.registerFunction = function (func, funcInfo) {
        this._injectableInfo.set(func, funcInfo);
    };
    Reflector.prototype.registerType = function (type, typeInfo) {
        this._injectableInfo.set(type, typeInfo);
    };
    Reflector.prototype.registerGetters = function (getters) {
        _mergeMaps(this._getters, getters);
    };
    Reflector.prototype.registerSetters = function (setters) {
        _mergeMaps(this._setters, setters);
    };
    Reflector.prototype.registerMethods = function (methods) {
        _mergeMaps(this._methods, methods);
    };
    Reflector.prototype.factory = function (type) {
        if (this._containsReflectionInfo(type)) {
            var res = this._injectableInfo.get(type)._factory;
            return lang_1.isPresent(res) ? res : null;
        }
        else {
            return this.reflectionCapabilities.factory(type);
        }
    };
    Reflector.prototype.parameters = function (typeOrFunc) {
        if (this._injectableInfo.has(typeOrFunc)) {
            var res = this._injectableInfo.get(typeOrFunc)._parameters;
            return lang_1.isPresent(res) ? res : [];
        }
        else {
            return this.reflectionCapabilities.parameters(typeOrFunc);
        }
    };
    Reflector.prototype.annotations = function (typeOrFunc) {
        if (this._injectableInfo.has(typeOrFunc)) {
            var res = this._injectableInfo.get(typeOrFunc)._annotations;
            return lang_1.isPresent(res) ? res : [];
        }
        else {
            return this.reflectionCapabilities.annotations(typeOrFunc);
        }
    };
    Reflector.prototype.interfaces = function (type) {
        if (this._injectableInfo.has(type)) {
            var res = this._injectableInfo.get(type)._interfaces;
            return lang_1.isPresent(res) ? res : [];
        }
        else {
            return this.reflectionCapabilities.interfaces(type);
        }
    };
    Reflector.prototype.getter = function (name) {
        if (this._getters.has(name)) {
            return this._getters.get(name);
        }
        else {
            return this.reflectionCapabilities.getter(name);
        }
    };
    Reflector.prototype.setter = function (name) {
        if (this._setters.has(name)) {
            return this._setters.get(name);
        }
        else {
            return this.reflectionCapabilities.setter(name);
        }
    };
    Reflector.prototype.method = function (name) {
        if (this._methods.has(name)) {
            return this._methods.get(name);
        }
        else {
            return this.reflectionCapabilities.method(name);
        }
    };
    Reflector.prototype._containsReflectionInfo = function (typeOrFunc) { return this._injectableInfo.has(typeOrFunc); };
    return Reflector;
})();
exports.Reflector = Reflector;
function _mergeMaps(target, config) {
    collection_1.StringMapWrapper.forEach(config, function (v, k) { return target.set(k, v); });
}
//# sourceMappingURL=reflector.js.map