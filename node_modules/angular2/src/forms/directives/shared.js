'use strict';var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var validators_1 = require('../validators');
function controlPath(name, parent) {
    var p = collection_1.ListWrapper.clone(parent.path);
    p.push(name);
    return p;
}
exports.controlPath = controlPath;
function setUpControl(c, dir) {
    if (lang_1.isBlank(c))
        _throwError(dir, "Cannot find control");
    if (lang_1.isBlank(dir.valueAccessor))
        _throwError(dir, "No value accessor for");
    c.validator = validators_1.Validators.compose([c.validator, dir.validator]);
    dir.valueAccessor.writeValue(c.value);
    // view -> model
    dir.valueAccessor.registerOnChange(function (newValue) {
        dir.viewToModelUpdate(newValue);
        c.updateValue(newValue, { emitModelToViewChange: false });
        c.markAsDirty();
    });
    // model -> view
    c.registerOnChange(function (newValue) { return dir.valueAccessor.writeValue(newValue); });
    // touched
    dir.valueAccessor.registerOnTouched(function () { return c.markAsTouched(); });
}
exports.setUpControl = setUpControl;
function composeNgValidator(ngValidators) {
    if (lang_1.isBlank(ngValidators))
        return validators_1.Validators.nullValidator;
    return validators_1.Validators.compose(ngValidators.map(function (v) { return v.validator; }));
}
exports.composeNgValidator = composeNgValidator;
function _throwError(dir, message) {
    var path = collection_1.ListWrapper.join(dir.path, " -> ");
    throw new lang_1.BaseException(message + " '" + path + "'");
}
function setProperty(renderer, elementRef, propName, propValue) {
    renderer.setElementProperty(elementRef, propName, propValue);
}
exports.setProperty = setProperty;
function isPropertyUpdated(changes, viewModel) {
    if (!collection_1.StringMapWrapper.contains(changes, "model"))
        return false;
    var change = changes["model"];
    if (change.isFirstChange())
        return true;
    return !lang_1.looseIdentical(viewModel, change.currentValue);
}
exports.isPropertyUpdated = isPropertyUpdated;
//# sourceMappingURL=shared.js.map