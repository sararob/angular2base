'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var di_1 = require('angular2/di');
var location_strategy_1 = require('./location_strategy');
var HTML5LocationStrategy = (function (_super) {
    __extends(HTML5LocationStrategy, _super);
    function HTML5LocationStrategy() {
        _super.call(this);
        this._location = dom_adapter_1.DOM.getLocation();
        this._history = dom_adapter_1.DOM.getHistory();
        this._baseHref = dom_adapter_1.DOM.getBaseHref();
    }
    HTML5LocationStrategy.prototype.onPopState = function (fn) {
        dom_adapter_1.DOM.getGlobalEventTarget('window').addEventListener('popstate', fn, false);
    };
    HTML5LocationStrategy.prototype.getBaseHref = function () { return this._baseHref; };
    HTML5LocationStrategy.prototype.path = function () { return this._location.pathname; };
    HTML5LocationStrategy.prototype.pushState = function (state, title, url) { this._history.pushState(state, title, url); };
    HTML5LocationStrategy.prototype.forward = function () { this._history.forward(); };
    HTML5LocationStrategy.prototype.back = function () { this._history.back(); };
    HTML5LocationStrategy = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], HTML5LocationStrategy);
    return HTML5LocationStrategy;
})(location_strategy_1.LocationStrategy);
exports.HTML5LocationStrategy = HTML5LocationStrategy;
//# sourceMappingURL=html5_location_strategy.js.map