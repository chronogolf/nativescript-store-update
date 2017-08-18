function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var date_picker_common_1 = require("./date-picker-common");
var utils_1 = require("../../utils/utils");
__export(require("./date-picker-common"));
var DatePicker = (function (_super) {
    __extends(DatePicker, _super);
    function DatePicker() {
        var _this = _super.call(this) || this;
        _this.nativeView = UIDatePicker.new();
        _this.nativeView.datePickerMode = 1;
        _this._changeHandler = UIDatePickerChangeHandlerImpl.initWithOwner(new WeakRef(_this));
        _this.nativeView.addTargetActionForControlEvents(_this._changeHandler, "valueChanged", 4096);
        return _this;
    }
    Object.defineProperty(DatePicker.prototype, "ios", {
        get: function () {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true
    });
    DatePicker.prototype[date_picker_common_1.yearProperty.getDefault] = function () {
        return this.nativeView.date.getFullYear();
    };
    DatePicker.prototype[date_picker_common_1.yearProperty.setNative] = function (value) {
        var picker = this.nativeView;
        var comps = utils_1.ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(4 | 8 | 16, picker.date);
        comps.year = value;
        this.date = new Date(comps.year, comps.month - 1, comps.day);
    };
    DatePicker.prototype[date_picker_common_1.monthProperty.getDefault] = function () {
        return this.nativeView.date.getMonth();
    };
    DatePicker.prototype[date_picker_common_1.monthProperty.setNative] = function (value) {
        var picker = this.nativeView;
        var comps = utils_1.ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(4 | 8 | 16, picker.date);
        comps.month = value;
        this.date = new Date(comps.year, comps.month - 1, comps.day);
    };
    DatePicker.prototype[date_picker_common_1.dayProperty.getDefault] = function () {
        return this.nativeView.date.getDay();
    };
    DatePicker.prototype[date_picker_common_1.dayProperty.setNative] = function (value) {
        var picker = this.nativeView;
        var comps = utils_1.ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(4 | 8 | 16, picker.date);
        comps.day = value;
        this.date = new Date(comps.year, comps.month - 1, comps.day);
    };
    DatePicker.prototype[date_picker_common_1.dateProperty.getDefault] = function () {
        return this.nativeView.date;
    };
    DatePicker.prototype[date_picker_common_1.dateProperty.setNative] = function (value) {
        var picker = this.nativeView;
        var comps = utils_1.ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(4 | 8 | 16, picker.date);
        comps.year = value.getFullYear();
        comps.month = value.getMonth() + 1;
        comps.day = value.getDate();
        picker.setDateAnimated(utils_1.ios.getter(NSCalendar, NSCalendar.currentCalendar).dateFromComponents(comps), false);
    };
    DatePicker.prototype[date_picker_common_1.maxDateProperty.getDefault] = function () {
        return this.nativeView.maximumDate;
    };
    DatePicker.prototype[date_picker_common_1.maxDateProperty.setNative] = function (value) {
        var picker = this.nativeView;
        var nsDate = NSDate.dateWithTimeIntervalSince1970(value.getTime() / 1000);
        picker.maximumDate = nsDate;
    };
    DatePicker.prototype[date_picker_common_1.minDateProperty.getDefault] = function () {
        return this.nativeView.minimumDate;
    };
    DatePicker.prototype[date_picker_common_1.minDateProperty.setNative] = function (value) {
        var picker = this.nativeView;
        var nsDate = NSDate.dateWithTimeIntervalSince1970(value.getTime() / 1000);
        picker.minimumDate = nsDate;
    };
    DatePicker.prototype[date_picker_common_1.colorProperty.getDefault] = function () {
        return this.nativeView.valueForKey("textColor");
    };
    DatePicker.prototype[date_picker_common_1.colorProperty.setNative] = function (value) {
        var picker = this.nativeView;
        picker.setValueForKey(value instanceof date_picker_common_1.Color ? value.ios : value, "textColor");
    };
    return DatePicker;
}(date_picker_common_1.DatePickerBase));
exports.DatePicker = DatePicker;
var UIDatePickerChangeHandlerImpl = (function (_super) {
    __extends(UIDatePickerChangeHandlerImpl, _super);
    function UIDatePickerChangeHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIDatePickerChangeHandlerImpl.initWithOwner = function (owner) {
        var impl = UIDatePickerChangeHandlerImpl.new();
        impl._owner = owner;
        return impl;
    };
    UIDatePickerChangeHandlerImpl.prototype.valueChanged = function (sender) {
        var comps = utils_1.ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(4 | 8 | 16, sender.date);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        var dateChanged = false;
        if (comps.year !== owner.year) {
            date_picker_common_1.yearProperty.nativeValueChange(owner, comps.year);
            dateChanged = true;
        }
        if (comps.month !== owner.month) {
            date_picker_common_1.monthProperty.nativeValueChange(owner, comps.month);
            dateChanged = true;
        }
        if (comps.day !== owner.day) {
            date_picker_common_1.dayProperty.nativeValueChange(owner, comps.day);
            dateChanged = true;
        }
        if (dateChanged) {
            date_picker_common_1.dateProperty.nativeValueChange(owner, new Date(comps.year, comps.month - 1, comps.day));
        }
    };
    UIDatePickerChangeHandlerImpl.ObjCExposedMethods = {
        'valueChanged': { returns: interop.types.void, params: [UIDatePicker] }
    };
    return UIDatePickerChangeHandlerImpl;
}(NSObject));
//# sourceMappingURL=date-picker.ios.js.map