'use strict';/**
 * @module
 * @description
 *
 * Annotations provide the additional information that Angular requires in order to run your
 * application. This module
 * contains {@link ComponentMetadata}, {@link DirectiveMetadata}, and {@link ViewMetadata}
 * annotations, as well as
 * the {@link Host} annotation that is used by Angular to resolve dependencies.
 *
 */
var metadata_1 = require('./src/core/metadata');
exports.ComponentMetadata = metadata_1.ComponentMetadata;
exports.DirectiveMetadata = metadata_1.DirectiveMetadata;
exports.PipeMetadata = metadata_1.PipeMetadata;
exports.LifecycleEvent = metadata_1.LifecycleEvent;
exports.ViewMetadata = metadata_1.ViewMetadata;
exports.ViewEncapsulation = metadata_1.ViewEncapsulation;
exports.QueryMetadata = metadata_1.QueryMetadata;
exports.AttributeMetadata = metadata_1.AttributeMetadata;
exports.Attribute = metadata_1.Attribute;
exports.Component = metadata_1.Component;
exports.Directive = metadata_1.Directive;
exports.View = metadata_1.View;
exports.Query = metadata_1.Query;
exports.ViewQuery = metadata_1.ViewQuery;
exports.Pipe = metadata_1.Pipe;
var decorators_1 = require('./src/util/decorators');
exports.Class = decorators_1.Class;
//# sourceMappingURL=metadata.js.map