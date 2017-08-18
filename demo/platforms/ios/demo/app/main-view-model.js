"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var nativescript_store_update_1 = require("nativescript-store-update");
var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    function HelloWorldModel() {
        var _this = _super.call(this) || this;
        _this.storeUpdate = new nativescript_store_update_1.StoreUpdate();
        _this.message = _this.storeUpdate.message;
        return _this;
    }
    return HelloWorldModel;
}(observable_1.Observable));
exports.HelloWorldModel = HelloWorldModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi12aWV3LW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi12aWV3LW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0RBQThEO0FBQzlELHVFQUF3RDtBQUV4RDtJQUFxQyxtQ0FBVTtJQUk3QztRQUFBLFlBQ0UsaUJBQU8sU0FJUjtRQUZDLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx1Q0FBVyxFQUFFLENBQUM7UUFDckMsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQzs7SUFDMUMsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQVZELENBQXFDLHVCQUFVLEdBVTlDO0FBVlksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUnO1xuaW1wb3J0IHsgU3RvcmVVcGRhdGUgfSBmcm9tICduYXRpdmVzY3JpcHQtc3RvcmUtdXBkYXRlJztcblxuZXhwb3J0IGNsYXNzIEhlbGxvV29ybGRNb2RlbCBleHRlbmRzIE9ic2VydmFibGUge1xuICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nO1xuICBwcml2YXRlIHN0b3JlVXBkYXRlOiBTdG9yZVVwZGF0ZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdG9yZVVwZGF0ZSA9IG5ldyBTdG9yZVVwZGF0ZSgpO1xuICAgIHRoaXMubWVzc2FnZSA9IHRoaXMuc3RvcmVVcGRhdGUubWVzc2FnZTtcbiAgfVxufVxuIl19