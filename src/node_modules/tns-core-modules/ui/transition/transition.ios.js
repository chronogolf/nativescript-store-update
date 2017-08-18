Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("../../trace");
var slideTransitionModule;
var fadeTransitionModule;
var UIViewControllerAnimatedTransitioningMethods;
(function (UIViewControllerAnimatedTransitioningMethods) {
    var methodSignature = NSMethodSignature.signatureWithObjCTypes("v@:c");
    var invocation = NSInvocation.invocationWithMethodSignature(methodSignature);
    invocation.selector = "completeTransition:";
    function completeTransition(didComplete) {
        var didCompleteReference = new interop.Reference(interop.types.bool, didComplete);
        invocation.setArgumentAtIndex(didCompleteReference, 2);
        invocation.invokeWithTarget(this);
    }
    UIViewControllerAnimatedTransitioningMethods.completeTransition = completeTransition;
})(UIViewControllerAnimatedTransitioningMethods || (UIViewControllerAnimatedTransitioningMethods = {}));
var AnimatedTransitioning = (function (_super) {
    __extends(AnimatedTransitioning, _super);
    function AnimatedTransitioning() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedTransitioning.init = function (transition, operation, fromVC, toVC) {
        var impl = AnimatedTransitioning.new();
        impl._transition = transition;
        impl._operation = operation;
        impl._fromVC = fromVC;
        impl._toVC = toVC;
        return impl;
    };
    AnimatedTransitioning.prototype.animateTransition = function (transitionContext) {
        var containerView = transitionContext.valueForKey("containerView");
        var completion = UIViewControllerAnimatedTransitioningMethods.completeTransition.bind(transitionContext);
        switch (this._operation) {
            case 1:
                this._transitionType = "push";
                break;
            case 2:
                this._transitionType = "pop";
                break;
            case 0:
                this._transitionType = "none";
                break;
        }
        if (trace_1.isEnabled()) {
            trace_1.write("START " + this._transition + " " + this._transitionType, trace_1.categories.Transition);
        }
        this._transition.animateIOSTransition(containerView, this._fromVC.view, this._toVC.view, this._operation, completion);
    };
    AnimatedTransitioning.prototype.transitionDuration = function (transitionContext) {
        return this._transition.getDuration();
    };
    AnimatedTransitioning.prototype.animationEnded = function (transitionCompleted) {
        if (transitionCompleted) {
            if (trace_1.isEnabled()) {
                trace_1.write("END " + this._transition + " " + this._transitionType, trace_1.categories.Transition);
            }
        }
        else {
            if (trace_1.isEnabled()) {
                trace_1.write("CANCEL " + this._transition + " " + this._transitionType, trace_1.categories.Transition);
            }
        }
    };
    AnimatedTransitioning.ObjCProtocols = [UIViewControllerAnimatedTransitioning];
    return AnimatedTransitioning;
}(NSObject));
var transitionId = 0;
var Transition = (function () {
    function Transition(duration, curve) {
        if (curve === void 0) { curve = 0; }
        this._duration = duration ? (duration / 1000) : 0.35;
        this._curve = curve;
        this._id = transitionId++;
    }
    Transition.prototype.getDuration = function () {
        return this._duration;
    };
    Transition.prototype.getCurve = function () {
        return this._curve;
    };
    Transition.prototype.animateIOSTransition = function (containerView, fromView, toView, operation, completion) {
        throw new Error("Abstract method call");
    };
    Transition.prototype.createAndroidAnimator = function (transitionType) {
        throw new Error("Abstract method call");
    };
    Transition.prototype.toString = function () {
        return "Transition@" + this._id;
    };
    return Transition;
}());
exports.Transition = Transition;
function _createIOSAnimatedTransitioning(navigationTransition, nativeCurve, operation, fromVC, toVC) {
    var transition;
    if (navigationTransition.name) {
        var name_1 = navigationTransition.name.toLowerCase();
        if (name_1.indexOf("slide") === 0) {
            var direction = name_1.substr("slide".length) || "left";
            if (!slideTransitionModule) {
                slideTransitionModule = require("ui/transition/slide-transition");
            }
            transition = new slideTransitionModule.SlideTransition(direction, navigationTransition.duration, nativeCurve);
        }
        else if (name_1 === "fade") {
            if (!fadeTransitionModule) {
                fadeTransitionModule = require("ui/transition/fade-transition");
            }
            transition = new fadeTransitionModule.FadeTransition(navigationTransition.duration, nativeCurve);
        }
    }
    else {
        transition = navigationTransition.instance;
    }
    if (transition) {
        return AnimatedTransitioning.init(transition, operation, fromVC, toVC);
    }
    return null;
}
exports._createIOSAnimatedTransitioning = _createIOSAnimatedTransitioning;
//# sourceMappingURL=transition.ios.js.map