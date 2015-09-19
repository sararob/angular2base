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
var async_1 = require('angular2/src/facade/async');
var di_1 = require('angular2/di');
/**
 * Responsible for performing each step of navigation.
 * "Steps" are conceptually similar to "middleware"
 */
var Pipeline = (function () {
    function Pipeline() {
        this.steps = [function (instruction) { return instruction.router.activateOutlets(instruction); }];
    }
    Pipeline.prototype.process = function (instruction) {
        var steps = this.steps, currentStep = 0;
        function processOne(result) {
            if (result === void 0) { result = true; }
            if (currentStep >= steps.length) {
                return async_1.PromiseWrapper.resolve(result);
            }
            var step = steps[currentStep];
            currentStep += 1;
            return async_1.PromiseWrapper.resolve(step(instruction)).then(processOne);
        }
        return processOne();
    };
    Pipeline = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Pipeline);
    return Pipeline;
})();
exports.Pipeline = Pipeline;
//# sourceMappingURL=pipeline.js.map