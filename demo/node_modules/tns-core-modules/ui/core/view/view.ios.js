function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var background_1 = require("../../styling/background");
var view_common_1 = require("./view-common");
var style_properties_1 = require("../../styling/style-properties");
var profiling_1 = require("../../../profiling");
__export(require("./view-common"));
var PFLAG_FORCE_LAYOUT = 1;
var PFLAG_MEASURED_DIMENSION_SET = 1 << 1;
var PFLAG_LAYOUT_REQUIRED = 1 << 2;
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._hasTransfrom = false;
        _this._privateFlags = PFLAG_LAYOUT_REQUIRED | PFLAG_FORCE_LAYOUT;
        _this._suspendCATransaction = false;
        return _this;
    }
    View.prototype._addViewCore = function (view, atIndex) {
        _super.prototype._addViewCore.call(this, view, atIndex);
        this.requestLayout();
    };
    View.prototype._removeViewCore = function (view) {
        _super.prototype._removeViewCore.call(this, view);
        this.requestLayout();
    };
    Object.defineProperty(View.prototype, "isLayoutRequired", {
        get: function () {
            return (this._privateFlags & PFLAG_LAYOUT_REQUIRED) === PFLAG_LAYOUT_REQUIRED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isLayoutRequested", {
        get: function () {
            return (this._privateFlags & PFLAG_FORCE_LAYOUT) === PFLAG_FORCE_LAYOUT;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        this._privateFlags |= PFLAG_FORCE_LAYOUT;
        var parent = this.parent;
        if (parent && !parent.isLayoutRequested) {
            parent.requestLayout();
        }
    };
    View.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        var measureSpecsChanged = this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        var forceLayout = (this._privateFlags & PFLAG_FORCE_LAYOUT) === PFLAG_FORCE_LAYOUT;
        if (forceLayout || measureSpecsChanged) {
            this._privateFlags &= ~PFLAG_MEASURED_DIMENSION_SET;
            this.onMeasure(widthMeasureSpec, heightMeasureSpec);
            this._privateFlags |= PFLAG_LAYOUT_REQUIRED;
            if ((this._privateFlags & PFLAG_MEASURED_DIMENSION_SET) !== PFLAG_MEASURED_DIMENSION_SET) {
                throw new Error("onMeasure() did not set the measured dimension by calling setMeasuredDimension() " + this);
            }
        }
    };
    View.prototype.layout = function (left, top, right, bottom) {
        var _a = this._setCurrentLayoutBounds(left, top, right, bottom), boundsChanged = _a.boundsChanged, sizeChanged = _a.sizeChanged;
        this.layoutNativeView(left, top, right, bottom);
        if (boundsChanged || (this._privateFlags & PFLAG_LAYOUT_REQUIRED) === PFLAG_LAYOUT_REQUIRED) {
            this.onLayout(left, top, right, bottom);
            this._privateFlags &= ~PFLAG_LAYOUT_REQUIRED;
        }
        if (sizeChanged) {
            this._onSizeChanged();
        }
        else if (this._nativeBackgroundState === "invalid") {
            var background = this.style.backgroundInternal;
            this._redrawNativeBackground(background);
        }
        this._privateFlags &= ~PFLAG_FORCE_LAYOUT;
    };
    View.prototype.setMeasuredDimension = function (measuredWidth, measuredHeight) {
        _super.prototype.setMeasuredDimension.call(this, measuredWidth, measuredHeight);
        this._privateFlags |= PFLAG_MEASURED_DIMENSION_SET;
    };
    View.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var view = this.nativeView;
        var width = view_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = view_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = view_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = view_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var nativeWidth = 0;
        var nativeHeight = 0;
        if (view) {
            var nativeSize = view_common_1.layout.measureNativeView(view, width, widthMode, height, heightMode);
            nativeWidth = nativeSize.width;
            nativeHeight = nativeSize.height;
        }
        var measureWidth = Math.max(nativeWidth, this.effectiveMinWidth);
        var measureHeight = Math.max(nativeHeight, this.effectiveMinHeight);
        var widthAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    View.prototype.onLayout = function (left, top, right, bottom) {
    };
    View.prototype._setNativeViewFrame = function (nativeView, frame) {
        if (!CGRectEqualToRect(nativeView.frame, frame)) {
            if (view_common_1.traceEnabled()) {
                view_common_1.traceWrite(this + ", Native setFrame: = " + NSStringFromCGRect(frame), view_common_1.traceCategories.Layout);
            }
            this._cachedFrame = frame;
            if (this._hasTransfrom) {
                var transform = nativeView.transform;
                nativeView.transform = CGAffineTransformIdentity;
                nativeView.frame = frame;
                nativeView.transform = transform;
            }
            else {
                nativeView.frame = frame;
            }
            var boundsOrigin = nativeView.bounds.origin;
            nativeView.bounds = CGRectMake(boundsOrigin.x, boundsOrigin.y, frame.size.width, frame.size.height);
        }
    };
    View.prototype.layoutNativeView = function (left, top, right, bottom) {
        if (!this.nativeView) {
            return;
        }
        var nativeView = this.nativeView;
        var frame = CGRectMake(view_common_1.layout.toDeviceIndependentPixels(left), view_common_1.layout.toDeviceIndependentPixels(top), view_common_1.layout.toDeviceIndependentPixels(right - left), view_common_1.layout.toDeviceIndependentPixels(bottom - top));
        this._setNativeViewFrame(nativeView, frame);
    };
    View.prototype._updateLayout = function () {
        var oldBounds = this._getCurrentLayoutBounds();
        this.layoutNativeView(oldBounds.left, oldBounds.top, oldBounds.right, oldBounds.bottom);
    };
    View.prototype.focus = function () {
        if (this.ios) {
            return this.ios.becomeFirstResponder();
        }
        return false;
    };
    View.prototype.getLocationInWindow = function () {
        if (!this.nativeView || !this.nativeView.window) {
            return undefined;
        }
        var pointInWindow = this.nativeView.convertPointToView(this.nativeView.bounds.origin, null);
        return {
            x: pointInWindow.x,
            y: pointInWindow.y
        };
    };
    View.prototype.getLocationOnScreen = function () {
        if (!this.nativeView || !this.nativeView.window) {
            return undefined;
        }
        var pointInWindow = this.nativeView.convertPointToView(this.nativeView.bounds.origin, null);
        var pointOnScreen = this.nativeView.window.convertPointToWindow(pointInWindow, null);
        return {
            x: pointOnScreen.x,
            y: pointOnScreen.y
        };
    };
    View.prototype.getLocationRelativeTo = function (otherView) {
        if (!this.nativeView || !this.nativeView.window ||
            !otherView.nativeView || !otherView.nativeView.window ||
            this.nativeView.window !== otherView.nativeView.window) {
            return undefined;
        }
        var myPointInWindow = this.nativeView.convertPointToView(this.nativeView.bounds.origin, null);
        var otherPointInWindow = otherView.nativeView.convertPointToView(otherView.nativeView.bounds.origin, null);
        return {
            x: myPointInWindow.x - otherPointInWindow.x,
            y: myPointInWindow.y - otherPointInWindow.y
        };
    };
    View.prototype._onSizeChanged = function () {
        var nativeView = this.nativeView;
        if (!nativeView) {
            return;
        }
        var background = this.style.backgroundInternal;
        var backgroundDependsOnSize = background.image || !background.hasUniformBorder();
        if (this._nativeBackgroundState === "invalid" || (this._nativeBackgroundState === "drawn" && backgroundDependsOnSize)) {
            this._redrawNativeBackground(background);
        }
        var clipPath = this.style.clipPath;
        if (clipPath !== "" && this[style_properties_1.clipPathProperty.setNative]) {
            this[style_properties_1.clipPathProperty.setNative](clipPath);
        }
    };
    View.prototype.updateNativeTransform = function () {
        var scaleX = this.scaleX || 1e-6;
        var scaleY = this.scaleY || 1e-6;
        var rotate = this.rotate || 0;
        var newTransform = CGAffineTransformIdentity;
        newTransform = CGAffineTransformTranslate(newTransform, this.translateX, this.translateY);
        newTransform = CGAffineTransformRotate(newTransform, rotate * Math.PI / 180);
        newTransform = CGAffineTransformScale(newTransform, scaleX, scaleY);
        if (!CGAffineTransformEqualToTransform(this.nativeView.transform, newTransform)) {
            var updateSuspended = this._isPresentationLayerUpdateSuspeneded();
            if (!updateSuspended) {
                CATransaction.begin();
            }
            this.nativeView.transform = newTransform;
            this._hasTransfrom = this.nativeView && !CGAffineTransformEqualToTransform(this.nativeView.transform, CGAffineTransformIdentity);
            if (!updateSuspended) {
                CATransaction.commit();
            }
        }
    };
    View.prototype.updateOriginPoint = function (originX, originY) {
        var newPoint = CGPointMake(originX, originY);
        this.nativeView.layer.anchorPoint = newPoint;
        if (this._cachedFrame) {
            this._setNativeViewFrame(this.nativeView, this._cachedFrame);
        }
    };
    View.prototype._suspendPresentationLayerUpdates = function () {
        this._suspendCATransaction = true;
    };
    View.prototype._resumePresentationLayerUpdates = function () {
        this._suspendCATransaction = false;
    };
    View.prototype._isPresentationLayerUpdateSuspeneded = function () {
        return this._suspendCATransaction || this._suspendNativeUpdatesCount;
    };
    View.prototype[view_common_1.isEnabledProperty.getDefault] = function () {
        var nativeView = this.nativeView;
        return nativeView instanceof UIControl ? nativeView.enabled : true;
    };
    View.prototype[view_common_1.isEnabledProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        if (nativeView instanceof UIControl) {
            nativeView.enabled = value;
        }
    };
    View.prototype[view_common_1.originXProperty.getDefault] = function () {
        return this.nativeView.layer.anchorPoint.x;
    };
    View.prototype[view_common_1.originXProperty.setNative] = function (value) {
        this.updateOriginPoint(value, this.originY);
    };
    View.prototype[view_common_1.originYProperty.getDefault] = function () {
        return this.nativeView.layer.anchorPoint.y;
    };
    View.prototype[view_common_1.originYProperty.setNative] = function (value) {
        this.updateOriginPoint(this.originX, value);
    };
    View.prototype[view_common_1.automationTextProperty.getDefault] = function () {
        return this.nativeView.accessibilityLabel;
    };
    View.prototype[view_common_1.automationTextProperty.setNative] = function (value) {
        this.nativeView.accessibilityIdentifier = value;
        this.nativeView.accessibilityLabel = value;
    };
    View.prototype[view_common_1.isUserInteractionEnabledProperty.getDefault] = function () {
        return this.nativeView.userInteractionEnabled;
    };
    View.prototype[view_common_1.isUserInteractionEnabledProperty.setNative] = function (value) {
        this.nativeView.userInteractionEnabled = value;
    };
    View.prototype[style_properties_1.visibilityProperty.getDefault] = function () {
        return this.nativeView.hidden ? style_properties_1.Visibility.COLLAPSE : style_properties_1.Visibility.VISIBLE;
    };
    View.prototype[style_properties_1.visibilityProperty.setNative] = function (value) {
        switch (value) {
            case style_properties_1.Visibility.VISIBLE:
                this.nativeView.hidden = false;
                break;
            case style_properties_1.Visibility.HIDDEN:
            case style_properties_1.Visibility.COLLAPSE:
                this.nativeView.hidden = true;
                break;
            default:
                throw new Error("Invalid visibility value: " + value + ". Valid values are: \"" + style_properties_1.Visibility.VISIBLE + "\", \"" + style_properties_1.Visibility.HIDDEN + "\", \"" + style_properties_1.Visibility.COLLAPSE + "\".");
        }
    };
    View.prototype[style_properties_1.opacityProperty.getDefault] = function () {
        return this.nativeView.alpha;
    };
    View.prototype[style_properties_1.opacityProperty.setNative] = function (value) {
        var nativeView = this.nativeView;
        var updateSuspended = this._isPresentationLayerUpdateSuspeneded();
        if (!updateSuspended) {
            CATransaction.begin();
        }
        nativeView.alpha = value;
        if (!updateSuspended) {
            CATransaction.commit();
        }
    };
    View.prototype[style_properties_1.rotateProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.rotateProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.scaleXProperty.getDefault] = function () {
        return 1;
    };
    View.prototype[style_properties_1.scaleXProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.scaleYProperty.getDefault] = function () {
        return 1;
    };
    View.prototype[style_properties_1.scaleYProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.translateXProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.translateXProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.translateYProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.translateYProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.zIndexProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.zIndexProperty.setNative] = function (value) {
        this.nativeView.layer.zPosition = value;
    };
    View.prototype[style_properties_1.backgroundInternalProperty.getDefault] = function () {
        return this.nativeView.backgroundColor;
    };
    View.prototype[style_properties_1.backgroundInternalProperty.setNative] = function (value) {
        this._nativeBackgroundState = "invalid";
        if (this.isLayoutValid) {
            this._redrawNativeBackground(value);
        }
    };
    View.prototype._redrawNativeBackground = function (value) {
        var _this = this;
        var updateSuspended = this._isPresentationLayerUpdateSuspeneded();
        if (!updateSuspended) {
            CATransaction.begin();
        }
        if (value instanceof UIColor) {
            this.nativeView.backgroundColor = value;
        }
        else {
            background_1.ios.createBackgroundUIColor(this, function (color) {
                _this.nativeView.backgroundColor = color;
            });
            this._setNativeClipToBounds();
        }
        if (!updateSuspended) {
            CATransaction.commit();
        }
        this._nativeBackgroundState = "drawn";
    };
    View.prototype._setNativeClipToBounds = function () {
        var backgroundInternal = this.style.backgroundInternal;
        this.nativeView.clipsToBounds = backgroundInternal.hasBorderWidth() || backgroundInternal.hasBorderRadius();
    };
    __decorate([
        profiling_1.profile
    ], View.prototype, "layout", null);
    __decorate([
        profiling_1.profile
    ], View.prototype, "onMeasure", null);
    return View;
}(view_common_1.ViewCommon));
exports.View = View;
View.prototype._nativeBackgroundState = "unset";
var CustomLayoutView = (function (_super) {
    __extends(CustomLayoutView, _super);
    function CustomLayoutView() {
        var _this = _super.call(this) || this;
        _this.nativeView = UIView.new();
        return _this;
    }
    Object.defineProperty(CustomLayoutView.prototype, "ios", {
        get: function () {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true
    });
    CustomLayoutView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
    };
    CustomLayoutView.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        _super.prototype._addViewToNativeVisualTree.call(this, child, atIndex);
        var parentNativeView = this.nativeView;
        var childNativeView = child.nativeView;
        if (parentNativeView && childNativeView) {
            if (typeof atIndex !== "number" || atIndex >= parentNativeView.subviews.count) {
                parentNativeView.addSubview(childNativeView);
            }
            else {
                parentNativeView.insertSubviewAtIndex(childNativeView, atIndex);
            }
            return true;
        }
        return false;
    };
    CustomLayoutView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (child.nativeView) {
            child.nativeView.removeFromSuperview();
        }
    };
    return CustomLayoutView;
}(View));
exports.CustomLayoutView = CustomLayoutView;
//# sourceMappingURL=view.ios.js.map