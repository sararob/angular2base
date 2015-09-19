'use strict';var impl_1 = require("angular2/src/web-workers/ui/impl");
/**
 * Bootstrapping a WebWorker
 *
 * You instantiate a WebWorker application by calling bootstrap with the URI of your worker's index
 * script
 * Note: The WebWorker script must call bootstrapWebworker once it is set up to complete the
 * bootstrapping process
 */
function bootstrap(uri) {
    var messageBus = spawnWebWorker(uri);
    impl_1.bootstrapUICommon(messageBus);
    return messageBus;
}
exports.bootstrap = bootstrap;
function spawnWebWorker(uri) {
    var webWorker = new Worker(uri);
    return new UIMessageBus(new UIMessageBusSink(webWorker), new UIMessageBusSource(webWorker));
}
exports.spawnWebWorker = spawnWebWorker;
var UIMessageBus = (function () {
    function UIMessageBus(sink, source) {
        this.sink = sink;
        this.source = source;
    }
    return UIMessageBus;
})();
exports.UIMessageBus = UIMessageBus;
var UIMessageBusSink = (function () {
    function UIMessageBusSink(_webWorker) {
        this._webWorker = _webWorker;
    }
    UIMessageBusSink.prototype.send = function (message) { this._webWorker.postMessage(message); };
    return UIMessageBusSink;
})();
exports.UIMessageBusSink = UIMessageBusSink;
var UIMessageBusSource = (function () {
    function UIMessageBusSource(_webWorker) {
        this._webWorker = _webWorker;
        this._listenerStore = new Map();
        this._numListeners = 0;
    }
    UIMessageBusSource.prototype.addListener = function (fn) {
        this._webWorker.addEventListener("message", fn);
        this._listenerStore[++this._numListeners] = fn;
        return this._numListeners;
    };
    UIMessageBusSource.prototype.removeListener = function (index) {
        removeEventListener("message", this._listenerStore[index]);
        this._listenerStore.delete(index);
    };
    return UIMessageBusSource;
})();
exports.UIMessageBusSource = UIMessageBusSource;
//# sourceMappingURL=application.js.map