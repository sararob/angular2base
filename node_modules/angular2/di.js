'use strict';/**
 * @module
 * @description
 * The `di` module provides dependency injection container services.
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var metadata_1 = require('./src/di/metadata');
exports.InjectMetadata = metadata_1.InjectMetadata;
exports.OptionalMetadata = metadata_1.OptionalMetadata;
exports.InjectableMetadata = metadata_1.InjectableMetadata;
exports.SelfMetadata = metadata_1.SelfMetadata;
exports.HostMetadata = metadata_1.HostMetadata;
exports.SkipSelfMetadata = metadata_1.SkipSelfMetadata;
exports.DependencyMetadata = metadata_1.DependencyMetadata;
// we have to reexport * because Dart and TS export two different sets of types
__export(require('./src/di/decorators'));
var forward_ref_1 = require('./src/di/forward_ref');
exports.forwardRef = forward_ref_1.forwardRef;
exports.resolveForwardRef = forward_ref_1.resolveForwardRef;
var injector_1 = require('./src/di/injector');
exports.Injector = injector_1.Injector;
exports.ProtoInjector = injector_1.ProtoInjector;
exports.BindingWithVisibility = injector_1.BindingWithVisibility;
exports.Visibility = injector_1.Visibility;
exports.UNDEFINED = injector_1.UNDEFINED;
var binding_1 = require('./src/di/binding');
exports.Binding = binding_1.Binding;
exports.BindingBuilder = binding_1.BindingBuilder;
exports.ResolvedBinding = binding_1.ResolvedBinding;
exports.Dependency = binding_1.Dependency;
exports.bind = binding_1.bind;
var key_1 = require('./src/di/key');
exports.Key = key_1.Key;
exports.KeyRegistry = key_1.KeyRegistry;
exports.TypeLiteral = key_1.TypeLiteral;
var exceptions_1 = require('./src/di/exceptions');
exports.NoBindingError = exceptions_1.NoBindingError;
exports.AbstractBindingError = exceptions_1.AbstractBindingError;
exports.CyclicDependencyError = exceptions_1.CyclicDependencyError;
exports.InstantiationError = exceptions_1.InstantiationError;
exports.InvalidBindingError = exceptions_1.InvalidBindingError;
exports.NoAnnotationError = exceptions_1.NoAnnotationError;
exports.OutOfBoundsError = exceptions_1.OutOfBoundsError;
var opaque_token_1 = require('./src/di/opaque_token');
exports.OpaqueToken = opaque_token_1.OpaqueToken;
//# sourceMappingURL=di.js.map