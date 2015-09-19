'use strict';/**
 * @module
 * @description
 * Define angular core API here.
 */
var application_tokens_1 = require('angular2/src/core/application_tokens');
exports.APP_COMPONENT = application_tokens_1.APP_COMPONENT;
var application_common_1 = require('angular2/src/core/application_common');
exports.ApplicationRef = application_common_1.ApplicationRef;
exports.bootstrap = application_common_1.commonBootstrap;
var lang_1 = require('angular2/src/facade/lang');
exports.Type = lang_1.Type;
// Compiler Related Dependencies.
var app_root_url_1 = require('angular2/src/services/app_root_url');
exports.AppRootUrl = app_root_url_1.AppRootUrl;
var url_resolver_1 = require('angular2/src/services/url_resolver');
exports.UrlResolver = url_resolver_1.UrlResolver;
var component_url_mapper_1 = require('angular2/src/core/compiler/component_url_mapper');
exports.ComponentUrlMapper = component_url_mapper_1.ComponentUrlMapper;
var directive_resolver_1 = require('angular2/src/core/compiler/directive_resolver');
exports.DirectiveResolver = directive_resolver_1.DirectiveResolver;
var compiler_1 = require('angular2/src/core/compiler/compiler');
exports.Compiler = compiler_1.Compiler;
var view_manager_1 = require('angular2/src/core/compiler/view_manager');
exports.AppViewManager = view_manager_1.AppViewManager;
var query_list_1 = require('angular2/src/core/compiler/query_list');
exports.QueryList = query_list_1.QueryList;
var dynamic_component_loader_1 = require('angular2/src/core/compiler/dynamic_component_loader');
exports.DynamicComponentLoader = dynamic_component_loader_1.DynamicComponentLoader;
var life_cycle_1 = require('angular2/src/core/life_cycle/life_cycle');
exports.LifeCycle = life_cycle_1.LifeCycle;
var element_ref_1 = require('angular2/src/core/compiler/element_ref');
exports.ElementRef = element_ref_1.ElementRef;
var template_ref_1 = require('angular2/src/core/compiler/template_ref');
exports.TemplateRef = template_ref_1.TemplateRef;
var view_ref_1 = require('angular2/src/core/compiler/view_ref');
exports.ViewRef = view_ref_1.ViewRef;
exports.ProtoViewRef = view_ref_1.ProtoViewRef;
var view_container_ref_1 = require('angular2/src/core/compiler/view_container_ref');
exports.ViewContainerRef = view_container_ref_1.ViewContainerRef;
var dynamic_component_loader_2 = require('angular2/src/core/compiler/dynamic_component_loader');
exports.ComponentRef = dynamic_component_loader_2.ComponentRef;
var ng_zone_1 = require('angular2/src/core/zone/ng_zone');
exports.NgZone = ng_zone_1.NgZone;
var async_1 = require('angular2/src/facade/async');
exports.Observable = async_1.Observable;
exports.EventEmitter = async_1.EventEmitter;
//# sourceMappingURL=core.js.map