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
var lang_1 = require("../../facade/lang");
var async_1 = require("angular2/src/facade/async");
var collection_1 = require("../../facade/collection");
var serializer_1 = require("angular2/src/web-workers/shared/serializer");
var di_1 = require("angular2/di");
var api_1 = require('angular2/src/render/api');
var ng_zone_1 = require('angular2/src/core/zone/ng_zone');
var event_deserializer_1 = require('./event_deserializer');
var MessageBroker = (function () {
    function MessageBroker(_messageBus, _serializer, _zone) {
        var _this = this;
        this._messageBus = _messageBus;
        this._serializer = _serializer;
        this._zone = _zone;
        this._pending = new Map();
        this._eventDispatchRegistry = new Map();
        this._messageBus.source.addListener(function (data) { return _this._handleMessage(data['data']); });
    }
    MessageBroker.prototype._generateMessageId = function (name) {
        var time = lang_1.stringify(lang_1.DateWrapper.toMillis(lang_1.DateWrapper.now()));
        var iteration = 0;
        var id = name + time + lang_1.stringify(iteration);
        while (lang_1.isPresent(this._pending[id])) {
            id = "" + name + time + iteration;
            iteration++;
        }
        return id;
    };
    MessageBroker.prototype.runOnUiThread = function (args, returnType) {
        var _this = this;
        var fnArgs = [];
        if (lang_1.isPresent(args.args)) {
            collection_1.ListWrapper.forEach(args.args, function (argument) {
                if (argument.type != null) {
                    fnArgs.push(_this._serializer.serialize(argument.value, argument.type));
                }
                else {
                    fnArgs.push(argument.value);
                }
            });
        }
        var promise;
        var id = null;
        if (returnType != null) {
            var completer = async_1.PromiseWrapper.completer();
            id = this._generateMessageId(args.type + args.method);
            this._pending.set(id, completer);
            async_1.PromiseWrapper.catchError(completer.promise, function (err, stack) {
                lang_1.print(err);
                completer.reject(err, stack);
            });
            promise = async_1.PromiseWrapper.then(completer.promise, function (value) {
                if (_this._serializer == null) {
                    return value;
                }
                else {
                    return _this._serializer.deserialize(value, returnType);
                }
            });
        }
        else {
            promise = null;
        }
        // TODO(jteplitz602): Create a class for these messages so we don't keep using StringMap
        var message = { 'type': args.type, 'method': args.method, 'args': fnArgs };
        if (id != null) {
            message['id'] = id;
        }
        this._messageBus.sink.send(message);
        return promise;
    };
    MessageBroker.prototype._handleMessage = function (message) {
        var data = new MessageData(message);
        // TODO(jteplitz602): replace these strings with messaging constants
        if (data.type === "event") {
            this._dispatchEvent(new RenderEventData(data.value, this._serializer));
        }
        else if (data.type === "result" || data.type === "error") {
            var id = data.id;
            if (this._pending.has(id)) {
                if (data.type === "result") {
                    this._pending.get(id).resolve(data.value);
                }
                else {
                    this._pending.get(id).reject(data.value, null);
                }
                this._pending.delete(id);
            }
        }
    };
    MessageBroker.prototype._dispatchEvent = function (eventData) {
        var dispatcher = this._eventDispatchRegistry.get(eventData.viewRef);
        this._zone.run(function () {
            eventData.locals['$event'] = event_deserializer_1.deserializeGenericEvent(eventData.locals['$event']);
            dispatcher.dispatchRenderEvent(eventData.elementIndex, eventData.eventName, eventData.locals);
        });
    };
    MessageBroker.prototype.registerEventDispatcher = function (viewRef, dispatcher) {
        this._eventDispatchRegistry.set(viewRef, dispatcher);
    };
    MessageBroker = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [Object, serializer_1.Serializer, ng_zone_1.NgZone])
    ], MessageBroker);
    return MessageBroker;
})();
exports.MessageBroker = MessageBroker;
var RenderEventData = (function () {
    function RenderEventData(message, serializer) {
        this.viewRef = serializer.deserialize(message['viewRef'], api_1.RenderViewRef);
        this.elementIndex = message['elementIndex'];
        this.eventName = message['eventName'];
        this.locals = collection_1.MapWrapper.createFromStringMap(message['locals']);
    }
    return RenderEventData;
})();
var MessageData = (function () {
    function MessageData(data) {
        this.type = collection_1.StringMapWrapper.get(data, "type");
        this.id = this._getValueIfPresent(data, "id");
        this.value = this._getValueIfPresent(data, "value");
    }
    /**
     * Returns the value from the StringMap if present. Otherwise returns null
     */
    MessageData.prototype._getValueIfPresent = function (data, key) {
        if (collection_1.StringMapWrapper.contains(data, key)) {
            return collection_1.StringMapWrapper.get(data, key);
        }
        else {
            return null;
        }
    };
    return MessageData;
})();
var FnArg = (function () {
    function FnArg(value, type) {
        this.value = value;
        this.type = type;
    }
    return FnArg;
})();
exports.FnArg = FnArg;
var UiArguments = (function () {
    function UiArguments(type, method, args) {
        this.type = type;
        this.method = method;
        this.args = args;
    }
    return UiArguments;
})();
exports.UiArguments = UiArguments;
//# sourceMappingURL=broker.js.map