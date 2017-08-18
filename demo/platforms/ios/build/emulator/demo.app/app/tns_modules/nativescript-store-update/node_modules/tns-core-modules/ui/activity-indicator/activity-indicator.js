function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var activity_indicator_common_1 = require("./activity-indicator-common");
__export(require("./activity-indicator-common"));
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        var _this = _super.call(this) || this;
        _this.nativeView = UIActivityIndicatorView.alloc().initWithActivityIndicatorStyle(2);
        _this.nativeView.hidesWhenStopped = true;
        return _this;
    }
    Object.defineProperty(ActivityIndicator.prototype, "ios", {
        get: function () {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true
    });
    ActivityIndicator.prototype[activity_indicator_common_1.busyProperty.getDefault] = function () {
        if (this.nativeView.isAnimating) {
            return this.nativeView.isAnimating();
        }
        else {
            return this.nativeView.animating;
        }
    };
    ActivityIndicator.prototype[activity_indicator_common_1.busyProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        if (value) {
            nativeView.startAnimating();
        }
        else {
            nativeView.stopAnimating();
        }
        if (nativeView.hidesWhenStopped) {
            this.requestLayout();
        }
    };
    ActivityIndicator.prototype[activity_indicator_common_1.colorProperty.getDefault] = function () {
        return this.nativeView.color;
    };
    ActivityIndicator.prototype[activity_indicator_common_1.colorProperty.setNative] = function (value) {
        this.nativeView.color = value instanceof activity_indicator_common_1.Color ? value.ios : value;
    };
    return ActivityIndicator;
}(activity_indicator_common_1.ActivityIndicatorBase));
exports.ActivityIndicator = ActivityIndicator;
//# sourceMappingURL=activity-indicator.js.map