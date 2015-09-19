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
var view_ref_1 = require('./view_ref');
var api_1 = require('angular2/src/render/api');
var view_manager_utils_1 = require('./view_manager_utils');
var view_pool_1 = require('./view_pool');
var view_listener_1 = require('./view_listener');
var profile_1 = require('../../profile/profile');
/**
 * Entry point for creating, moving views in the view hierarchy and destroying views.
 * This manager contains all recursion and delegates to helper methods
 * in AppViewManagerUtils and the Renderer, so unit tests get simpler.
 */
var AppViewManager = (function () {
    /**
     * @private
     */
    function AppViewManager(_viewPool, _viewListener, _utils, _renderer) {
        this._viewPool = _viewPool;
        this._viewListener = _viewListener;
        this._utils = _utils;
        this._renderer = _renderer;
        this._scope_createRootHostView = profile_1.wtfCreateScope('AppViewManager#createRootHostView()');
        this._scope_destroyRootHostView = profile_1.wtfCreateScope('AppViewManager#destroyRootHostView()');
        this._scope_createEmbeddedViewInContainer = profile_1.wtfCreateScope('AppViewManager#createEmbeddedViewInContainer()');
        this._scope_createHostViewInContainer = profile_1.wtfCreateScope('AppViewManager#createHostViewInContainer()');
        this._scope_destroyViewInContainer = profile_1.wtfCreateScope('AppViewMananger#destroyViewInContainer()');
        this._scope_attachViewInContainer = profile_1.wtfCreateScope('AppViewMananger#attachViewInContainer()');
        this._scope_detachViewInContainer = profile_1.wtfCreateScope('AppViewMananger#detachViewInContainer()');
    }
    /**
     * Returns a {@link ViewContainerRef} at the {@link ElementRef} location.
     */
    AppViewManager.prototype.getViewContainer = function (location) {
        var hostView = view_ref_1.internalView(location.parentView);
        return hostView.elementInjectors[location.boundElementIndex].getViewContainerRef();
    };
    /**
     * Return the first child element of the host element view.
     */
    AppViewManager.prototype.getHostElement = function (hostViewRef) {
        var hostView = view_ref_1.internalView(hostViewRef);
        if (hostView.proto.type !== api_1.ViewType.HOST) {
            throw new lang_1.BaseException('This operation is only allowed on host views');
        }
        return hostView.elementRefs[hostView.elementOffset];
    };
    /**
     * Returns an ElementRef for the element with the given variable name
     * in the current view.
     *
     * - `hostLocation`: {@link ElementRef} of any element in the View which defines the scope of
     *   search.
     * - `variableName`: Name of the variable to locate.
     * - Returns {@link ElementRef} of the found element or null. (Throws if not found.)
     */
    AppViewManager.prototype.getNamedElementInComponentView = function (hostLocation, variableName) {
        var hostView = view_ref_1.internalView(hostLocation.parentView);
        var boundElementIndex = hostLocation.boundElementIndex;
        var componentView = hostView.getNestedView(boundElementIndex);
        if (lang_1.isBlank(componentView)) {
            throw new lang_1.BaseException("There is no component directive at element " + boundElementIndex);
        }
        var binderIdx = componentView.proto.variableLocations.get(variableName);
        if (lang_1.isBlank(binderIdx)) {
            throw new lang_1.BaseException("Could not find variable " + variableName);
        }
        return componentView.elementRefs[componentView.elementOffset + binderIdx];
    };
    /**
     * Returns the component instance for a given element.
     *
     * The component is the execution context as seen by an expression at that {@link ElementRef}
     * location.
     */
    AppViewManager.prototype.getComponent = function (hostLocation) {
        var hostView = view_ref_1.internalView(hostLocation.parentView);
        var boundElementIndex = hostLocation.boundElementIndex;
        return this._utils.getComponentInstance(hostView, boundElementIndex);
    };
    /**
     * Load component view into existing element.
     *
     * Use this if a host element is already in the DOM and it is necessary to upgrade
     * the element into Angular component by attaching a view but reusing the existing element.
     *
     * - `hostProtoViewRef`: {@link ProtoViewRef} Proto view to use in creating a view for this
     *   component.
     * - `overrideSelector`: (optional) selector to use in locating the existing element to load
     *   the view into. If not specified use the selector in the component definition of the
     *   `hostProtoView`.
     * - injector: {@link Injector} to use as parent injector for the view.
     *
     * See {@link AppViewManager#destroyRootHostView}.
     *
     * ## Example
     *
     * ```
     * @ng.Component({
     *   selector: 'child-component'
     * })
     * @ng.View({
     *   template: 'Child'
     * })
     * class ChildComponent {
     *
     * }
     *
     * @ng.Component({
     *   selector: 'my-app'
     * })
     * @ng.View({
     *   template: `
     *     Parent (<some-component></some-component>)
     *   `
     * })
     * class MyApp {
     *   viewRef: ng.ViewRef;
     *
     *   constructor(public appViewManager: ng.AppViewManager, compiler: ng.Compiler) {
     *     compiler.compileInHost(ChildComponent).then((protoView: ng.ProtoViewRef) => {
     *       this.viewRef = appViewManager.createRootHostView(protoView, 'some-component', null);
     *     })
     *   }
     *
     *   onDestroy() {
     *     this.appViewManager.destroyRootHostView(this.viewRef);
     *     this.viewRef = null;
     *   }
     * }
     *
     * ng.bootstrap(MyApp);
     * ```
     */
    AppViewManager.prototype.createRootHostView = function (hostProtoViewRef, overrideSelector, injector) {
        var s = this._scope_createRootHostView();
        var hostProtoView = view_ref_1.internalProtoView(hostProtoViewRef);
        var hostElementSelector = overrideSelector;
        if (lang_1.isBlank(hostElementSelector)) {
            hostElementSelector = hostProtoView.elementBinders[0].componentDirective.metadata.selector;
        }
        var renderViewWithFragments = this._renderer.createRootHostView(hostProtoView.mergeMapping.renderProtoViewRef, hostProtoView.mergeMapping.renderFragmentCount, hostElementSelector);
        var hostView = this._createMainView(hostProtoView, renderViewWithFragments);
        this._renderer.hydrateView(hostView.render);
        this._utils.hydrateRootHostView(hostView, injector);
        return profile_1.wtfLeave(s, hostView.ref);
    };
    /**
     * Remove the View created with {@link AppViewManager#createRootHostView}.
     */
    AppViewManager.prototype.destroyRootHostView = function (hostViewRef) {
        // Note: Don't put the hostView into the view pool
        // as it is depending on the element for which it was created.
        var s = this._scope_destroyRootHostView();
        var hostView = view_ref_1.internalView(hostViewRef);
        this._renderer.detachFragment(hostView.renderFragment);
        this._renderer.dehydrateView(hostView.render);
        this._viewDehydrateRecurse(hostView);
        this._viewListener.viewDestroyed(hostView);
        this._renderer.destroyView(hostView.render);
        profile_1.wtfLeave(s);
    };
    /**
     *
     * See {@link AppViewManager#destroyViewInContainer}.
     */
    AppViewManager.prototype.createEmbeddedViewInContainer = function (viewContainerLocation, atIndex, templateRef) {
        var s = this._scope_createEmbeddedViewInContainer();
        var protoView = view_ref_1.internalProtoView(templateRef.protoViewRef);
        if (protoView.type !== api_1.ViewType.EMBEDDED) {
            throw new lang_1.BaseException('This method can only be called with embedded ProtoViews!');
        }
        return profile_1.wtfLeave(s, this._createViewInContainer(viewContainerLocation, atIndex, protoView, templateRef.elementRef, null));
    };
    /**
     *
     * See {@link AppViewManager#destroyViewInContainer}.
     */
    AppViewManager.prototype.createHostViewInContainer = function (viewContainerLocation, atIndex, protoViewRef, imperativelyCreatedInjector) {
        var s = this._scope_createHostViewInContainer();
        var protoView = view_ref_1.internalProtoView(protoViewRef);
        if (protoView.type !== api_1.ViewType.HOST) {
            throw new lang_1.BaseException('This method can only be called with host ProtoViews!');
        }
        return profile_1.wtfLeave(s, this._createViewInContainer(viewContainerLocation, atIndex, protoView, viewContainerLocation, imperativelyCreatedInjector));
    };
    /**
     *
     * See {@link AppViewManager#destroyViewInContainer}.
     */
    AppViewManager.prototype._createViewInContainer = function (viewContainerLocation, atIndex, protoView, context, imperativelyCreatedInjector) {
        var parentView = view_ref_1.internalView(viewContainerLocation.parentView);
        var boundElementIndex = viewContainerLocation.boundElementIndex;
        var contextView = view_ref_1.internalView(context.parentView);
        var contextBoundElementIndex = context.boundElementIndex;
        var embeddedFragmentView = contextView.getNestedView(contextBoundElementIndex);
        var view;
        if (protoView.type === api_1.ViewType.EMBEDDED && lang_1.isPresent(embeddedFragmentView) &&
            !embeddedFragmentView.hydrated()) {
            // Case 1: instantiate the first view of a template that has been merged into a parent
            view = embeddedFragmentView;
            this._attachRenderView(parentView, boundElementIndex, atIndex, view);
        }
        else {
            // Case 2: instantiate another copy of the template or a host ProtoView.
            // This is a separate case
            // as we only inline one copy of the template into the parent view.
            view = this._createPooledView(protoView);
            this._attachRenderView(parentView, boundElementIndex, atIndex, view);
            this._renderer.hydrateView(view.render);
        }
        this._utils.attachViewInContainer(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, view);
        this._utils.hydrateViewInContainer(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, imperativelyCreatedInjector);
        return view.ref;
    };
    AppViewManager.prototype._attachRenderView = function (parentView, boundElementIndex, atIndex, view) {
        var elementRef = parentView.elementRefs[boundElementIndex];
        if (atIndex === 0) {
            this._renderer.attachFragmentAfterElement(elementRef, view.renderFragment);
        }
        else {
            var prevView = parentView.viewContainers[boundElementIndex].views[atIndex - 1];
            this._renderer.attachFragmentAfterFragment(prevView.renderFragment, view.renderFragment);
        }
    };
    /**
     *
     * See {@link AppViewManager#createViewInContainer}.
     */
    AppViewManager.prototype.destroyViewInContainer = function (viewContainerLocation, atIndex) {
        var s = this._scope_destroyViewInContainer();
        var parentView = view_ref_1.internalView(viewContainerLocation.parentView);
        var boundElementIndex = viewContainerLocation.boundElementIndex;
        this._destroyViewInContainer(parentView, boundElementIndex, atIndex);
        profile_1.wtfLeave(s);
    };
    /**
     *
     * See {@link AppViewManager#detachViewInContainer}.
     */
    AppViewManager.prototype.attachViewInContainer = function (viewContainerLocation, atIndex, viewRef) {
        var s = this._scope_attachViewInContainer();
        var view = view_ref_1.internalView(viewRef);
        var parentView = view_ref_1.internalView(viewContainerLocation.parentView);
        var boundElementIndex = viewContainerLocation.boundElementIndex;
        // TODO(tbosch): the public methods attachViewInContainer/detachViewInContainer
        // are used for moving elements without the same container.
        // We will change this into an atomic `move` operation, which should preserve the
        // previous parent injector (see https://github.com/angular/angular/issues/1377).
        // Right now we are destroying any special
        // context view that might have been used.
        this._utils.attachViewInContainer(parentView, boundElementIndex, null, null, atIndex, view);
        this._attachRenderView(parentView, boundElementIndex, atIndex, view);
        return profile_1.wtfLeave(s, viewRef);
    };
    /**
     *
     * See {@link AppViewManager#attachViewInContainer}.
     */
    AppViewManager.prototype.detachViewInContainer = function (viewContainerLocation, atIndex) {
        var s = this._scope_detachViewInContainer();
        var parentView = view_ref_1.internalView(viewContainerLocation.parentView);
        var boundElementIndex = viewContainerLocation.boundElementIndex;
        var viewContainer = parentView.viewContainers[boundElementIndex];
        var view = viewContainer.views[atIndex];
        this._utils.detachViewInContainer(parentView, boundElementIndex, atIndex);
        this._renderer.detachFragment(view.renderFragment);
        return profile_1.wtfLeave(s, view.ref);
    };
    AppViewManager.prototype._createMainView = function (protoView, renderViewWithFragments) {
        var mergedParentView = this._utils.createView(protoView, renderViewWithFragments, this, this._renderer);
        this._renderer.setEventDispatcher(mergedParentView.render, mergedParentView);
        this._viewListener.viewCreated(mergedParentView);
        return mergedParentView;
    };
    AppViewManager.prototype._createPooledView = function (protoView) {
        var view = this._viewPool.getView(protoView);
        if (lang_1.isBlank(view)) {
            view = this._createMainView(protoView, this._renderer.createView(protoView.mergeMapping.renderProtoViewRef, protoView.mergeMapping.renderFragmentCount));
        }
        return view;
    };
    AppViewManager.prototype._destroyPooledView = function (view) {
        var wasReturned = this._viewPool.returnView(view);
        if (!wasReturned) {
            this._viewListener.viewDestroyed(view);
            this._renderer.destroyView(view.render);
        }
    };
    AppViewManager.prototype._destroyViewInContainer = function (parentView, boundElementIndex, atIndex) {
        var viewContainer = parentView.viewContainers[boundElementIndex];
        var view = viewContainer.views[atIndex];
        this._viewDehydrateRecurse(view);
        this._utils.detachViewInContainer(parentView, boundElementIndex, atIndex);
        if (view.viewOffset > 0) {
            // Case 1: a view that is part of another view.
            // Just detach the fragment
            this._renderer.detachFragment(view.renderFragment);
        }
        else {
            // Case 2: a view that is not part of another view.
            // dehydrate and destroy it.
            this._renderer.dehydrateView(view.render);
            this._renderer.detachFragment(view.renderFragment);
            this._destroyPooledView(view);
        }
    };
    AppViewManager.prototype._viewDehydrateRecurse = function (view) {
        if (view.hydrated()) {
            this._utils.dehydrateView(view);
        }
        var viewContainers = view.viewContainers;
        var startViewOffset = view.viewOffset;
        var endViewOffset = view.viewOffset + view.mainMergeMapping.nestedViewCountByViewIndex[view.viewOffset];
        var elementOffset = view.elementOffset;
        for (var viewIdx = startViewOffset; viewIdx <= endViewOffset; viewIdx++) {
            var currView = view.views[viewIdx];
            for (var binderIdx = 0; binderIdx < currView.proto.elementBinders.length; binderIdx++, elementOffset++) {
                var vc = viewContainers[elementOffset];
                if (lang_1.isPresent(vc)) {
                    for (var j = vc.views.length - 1; j >= 0; j--) {
                        this._destroyViewInContainer(currView, elementOffset, j);
                    }
                }
            }
        }
    };
    AppViewManager = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [view_pool_1.AppViewPool, view_listener_1.AppViewListener, view_manager_utils_1.AppViewManagerUtils, api_1.Renderer])
    ], AppViewManager);
    return AppViewManager;
})();
exports.AppViewManager = AppViewManager;
//# sourceMappingURL=view_manager.js.map