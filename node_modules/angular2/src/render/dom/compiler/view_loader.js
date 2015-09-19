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
var async_1 = require('angular2/src/facade/async');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var xhr_1 = require('angular2/src/render/xhr');
var style_inliner_1 = require('./style_inliner');
var style_url_resolver_1 = require('./style_url_resolver');
var profile_1 = require('../../../profile/profile');
var TemplateAndStyles = (function () {
    function TemplateAndStyles(template, styles) {
        this.template = template;
        this.styles = styles;
    }
    return TemplateAndStyles;
})();
exports.TemplateAndStyles = TemplateAndStyles;
/**
 * Strategy to load component views.
 * TODO: Make public API once we are more confident in this approach.
 */
var ViewLoader = (function () {
    function ViewLoader(_xhr, _styleInliner, _styleUrlResolver) {
        this._xhr = _xhr;
        this._styleInliner = _styleInliner;
        this._styleUrlResolver = _styleUrlResolver;
        this._cache = new collection_1.Map();
    }
    ViewLoader.prototype.load = function (viewDef) {
        var _this = this;
        var r = profile_1.wtfStartTimeRange('ViewLoader#load()', lang_1.stringify(viewDef.componentId));
        var tplAndStyles = [this._loadHtml(viewDef.template, viewDef.templateAbsUrl)];
        if (lang_1.isPresent(viewDef.styles)) {
            viewDef.styles.forEach(function (cssText) {
                var textOrPromise = _this._resolveAndInlineCssText(cssText, viewDef.templateAbsUrl);
                tplAndStyles.push(textOrPromise);
            });
        }
        if (lang_1.isPresent(viewDef.styleAbsUrls)) {
            viewDef.styleAbsUrls.forEach(function (url) {
                var promise = _this._loadText(url).then(function (cssText) { return _this._resolveAndInlineCssText(cssText, viewDef.templateAbsUrl); });
                tplAndStyles.push(promise);
            });
        }
        // Inline the styles from the @View annotation
        return async_1.PromiseWrapper.all(tplAndStyles)
            .then(function (res) {
            var loadedTplAndStyles = res[0];
            var styles = collection_1.ListWrapper.slice(res, 1);
            var templateAndStyles = new TemplateAndStyles(loadedTplAndStyles.template, loadedTplAndStyles.styles.concat(styles));
            profile_1.wtfEndTimeRange(r);
            return templateAndStyles;
        });
    };
    ViewLoader.prototype._loadText = function (url) {
        var response = this._cache.get(url);
        if (lang_1.isBlank(response)) {
            // TODO(vicb): change error when TS gets fixed
            // https://github.com/angular/angular/issues/2280
            // throw new BaseException(`Failed to fetch url "${url}"`);
            response = async_1.PromiseWrapper.catchError(this._xhr.get(url), function (_) { return async_1.PromiseWrapper.reject(new lang_1.BaseException("Failed to fetch url \"" + url + "\""), null); });
            this._cache.set(url, response);
        }
        return response;
    };
    // Load the html and inline any style tags
    ViewLoader.prototype._loadHtml = function (template, templateAbsUrl) {
        var _this = this;
        var html;
        // Load the HTML
        if (lang_1.isPresent(template)) {
            html = async_1.PromiseWrapper.resolve(template);
        }
        else if (lang_1.isPresent(templateAbsUrl)) {
            html = this._loadText(templateAbsUrl);
        }
        else {
            throw new lang_1.BaseException('View should have either the templateUrl or template property set');
        }
        return html.then(function (html) {
            var tplEl = dom_adapter_1.DOM.createTemplate(html);
            // Replace $baseUrl with the base url for the template
            if (lang_1.isPresent(templateAbsUrl) && templateAbsUrl.indexOf("/") >= 0) {
                var baseUrl = templateAbsUrl.substring(0, templateAbsUrl.lastIndexOf("/"));
                _this._substituteBaseUrl(dom_adapter_1.DOM.content(tplEl), baseUrl);
            }
            var styleEls = dom_adapter_1.DOM.querySelectorAll(dom_adapter_1.DOM.content(tplEl), 'STYLE');
            var unresolvedStyles = [];
            for (var i = 0; i < styleEls.length; i++) {
                var styleEl = styleEls[i];
                unresolvedStyles.push(dom_adapter_1.DOM.getText(styleEl));
                dom_adapter_1.DOM.remove(styleEl);
            }
            var syncStyles = [];
            var asyncStyles = [];
            // Inline the style tags from the html
            for (var i = 0; i < styleEls.length; i++) {
                var styleEl_1 = styleEls[i];
                var resolvedStyled = _this._resolveAndInlineCssText(dom_adapter_1.DOM.getText(styleEl_1), templateAbsUrl);
                if (lang_1.isPromise(resolvedStyled)) {
                    asyncStyles.push(resolvedStyled);
                }
                else {
                    syncStyles.push(resolvedStyled);
                }
            }
            if (asyncStyles.length === 0) {
                return async_1.PromiseWrapper.resolve(new TemplateAndStyles(dom_adapter_1.DOM.getInnerHTML(tplEl), syncStyles));
            }
            else {
                return async_1.PromiseWrapper.all(asyncStyles)
                    .then(function (loadedStyles) { return new TemplateAndStyles(dom_adapter_1.DOM.getInnerHTML(tplEl), syncStyles.concat(loadedStyles)); });
            }
        });
    };
    /**
     * Replace all occurrences of $baseUrl in the attributes of an element and its
     * children with the base URL of the template.
     *
     * @param element The element to process
     * @param baseUrl The base URL of the template.
     * @private
     */
    ViewLoader.prototype._substituteBaseUrl = function (element, baseUrl) {
        if (dom_adapter_1.DOM.isElementNode(element)) {
            var attrs = dom_adapter_1.DOM.attributeMap(element);
            collection_1.MapWrapper.forEach(attrs, function (v, k) {
                if (lang_1.isPresent(v) && v.indexOf('$baseUrl') >= 0) {
                    dom_adapter_1.DOM.setAttribute(element, k, lang_1.StringWrapper.replaceAll(v, /\$baseUrl/g, baseUrl));
                }
            });
        }
        var children = dom_adapter_1.DOM.childNodes(element);
        for (var i = 0; i < children.length; i++) {
            if (dom_adapter_1.DOM.isElementNode(children[i])) {
                this._substituteBaseUrl(children[i], baseUrl);
            }
        }
    };
    ViewLoader.prototype._resolveAndInlineCssText = function (cssText, baseUrl) {
        cssText = this._styleUrlResolver.resolveUrls(cssText, baseUrl);
        return this._styleInliner.inlineImports(cssText, baseUrl);
    };
    ViewLoader = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [xhr_1.XHR, style_inliner_1.StyleInliner, style_url_resolver_1.StyleUrlResolver])
    ], ViewLoader);
    return ViewLoader;
})();
exports.ViewLoader = ViewLoader;
//# sourceMappingURL=view_loader.js.map