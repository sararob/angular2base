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
var lang_1 = require("angular2/src/facade/lang");
/**
 * A parameter metadata that specifies a dependency.
 *
 * ```
 * class AComponent {
 *   constructor(@Inject(MyService) aService:MyService) {}
 * }
 * ```
 */
var InjectMetadata = (function () {
    function InjectMetadata(token) {
        this.token = token;
    }
    InjectMetadata.prototype.toString = function () { return "@Inject(" + lang_1.stringify(this.token) + ")"; };
    InjectMetadata = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [Object])
    ], InjectMetadata);
    return InjectMetadata;
})();
exports.InjectMetadata = InjectMetadata;
/**
 * A parameter metadata that marks a dependency as optional. {@link Injector} provides `null` if
 * the dependency is not found.
 *
 * ```
 * class AComponent {
 *   constructor(@Optional() aService:MyService) {
 *     this.aService = aService;
 *   }
 * }
 * ```
 */
var OptionalMetadata = (function () {
    function OptionalMetadata() {
    }
    OptionalMetadata.prototype.toString = function () { return "@Optional()"; };
    OptionalMetadata = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [])
    ], OptionalMetadata);
    return OptionalMetadata;
})();
exports.OptionalMetadata = OptionalMetadata;
/**
 * `DependencyMetadata is used by the framework to extend DI.
 *
 * Only metadata implementing `DependencyMetadata` are added to the list of dependency
 * properties.
 *
 * For example:
 *
 * ```
 * class Exclude extends DependencyMetadata {}
 * class NotDependencyProperty {}
 *
 * class AComponent {
 *   constructor(@Exclude @NotDependencyProperty aService:AService) {}
 * }
 * ```
 *
 * will create the following dependency:
 *
 * ```
 * new Dependency(Key.get(AService), [new Exclude()])
 * ```
 *
 * The framework can use `new Exclude()` to handle the `aService` dependency
 * in a specific way.
 */
var DependencyMetadata = (function () {
    function DependencyMetadata() {
    }
    Object.defineProperty(DependencyMetadata.prototype, "token", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    DependencyMetadata = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [])
    ], DependencyMetadata);
    return DependencyMetadata;
})();
exports.DependencyMetadata = DependencyMetadata;
/**
 * A marker metadata that marks a class as available to `Injector` for creation. Used by tooling
 * for generating constructor stubs.
 *
 * ```
 * class NeedsService {
 *   constructor(svc:UsefulService) {}
 * }
 *
 * @Injectable
 * class UsefulService {}
 * ```
 */
var InjectableMetadata = (function () {
    function InjectableMetadata() {
    }
    InjectableMetadata = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [])
    ], InjectableMetadata);
    return InjectableMetadata;
})();
exports.InjectableMetadata = InjectableMetadata;
/**
 * Specifies that an injector should retrieve a dependency from itself.
 *
 * ## Example
 *
 * ```
 * class Dependency {
 * }
 *
 * class NeedsDependency {
 *   constructor(public @Self() dependency:Dependency) {}
 * }
 *
 * var inj = Injector.resolveAndCreate([Dependency, NeedsDependency]);
 * var nd = inj.get(NeedsDependency);
 * expect(nd.dependency).toBeAnInstanceOf(Dependency);
 * ```
 */
var SelfMetadata = (function () {
    function SelfMetadata() {
    }
    SelfMetadata.prototype.toString = function () { return "@Self()"; };
    SelfMetadata = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [])
    ], SelfMetadata);
    return SelfMetadata;
})();
exports.SelfMetadata = SelfMetadata;
/**
 * Specifies that the dependency resolution should start from the parent injector.
 *
 * ## Example
 *
 *
 * ```
 * class Service {}
 *
 * class ParentService implements Service {
 * }
 *
 * class ChildService implements Service {
 *   constructor(public @SkipSelf() parentService:Service) {}
 * }
 *
 * var parent = Injector.resolveAndCreate([
 *   bind(Service).toClass(ParentService)
 * ]);
 * var child = parent.resolveAndCreateChild([
 *   bind(Service).toClass(ChildSerice)
 * ]);
 * var s = child.get(Service);
 * expect(s).toBeAnInstanceOf(ChildService);
 * expect(s.parentService).toBeAnInstanceOf(ParentService);
 * ```
 */
var SkipSelfMetadata = (function () {
    function SkipSelfMetadata() {
    }
    SkipSelfMetadata.prototype.toString = function () { return "@SkipSelf()"; };
    SkipSelfMetadata = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [])
    ], SkipSelfMetadata);
    return SkipSelfMetadata;
})();
exports.SkipSelfMetadata = SkipSelfMetadata;
/**
 * Specifies that an injector should retrieve a dependency from any injector until reaching the
 * closest host.
 *
 * ## Example
 *
 * ```
 * class Dependency {
 * }
 *
 * class NeedsDependency {
 *   constructor(public @Host() dependency:Dependency) {}
 * }
 *
 * var parent = Injector.resolveAndCreate([
 *   bind(Dependency).toClass(HostDependency)
 * ]);
 * var child = parent.resolveAndCreateChild([]);
 * var grandChild = child.resolveAndCreateChild([NeedsDependency, Depedency]);
 * var nd = grandChild.get(NeedsDependency);
 * expect(nd.dependency).toBeAnInstanceOf(HostDependency);
 * ```
 */
var HostMetadata = (function () {
    function HostMetadata() {
    }
    HostMetadata.prototype.toString = function () { return "@Host()"; };
    HostMetadata = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [])
    ], HostMetadata);
    return HostMetadata;
})();
exports.HostMetadata = HostMetadata;
//# sourceMappingURL=metadata.js.map