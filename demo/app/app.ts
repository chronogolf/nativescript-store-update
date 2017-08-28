import "./bundle-config";
import * as application from "tns-core-modules/application";
import { StoreUpdate, AlertTypesConstant } from "nativescript-store-update";

StoreUpdate.init({
  notifyNbDaysAfterRelease: 1,
  majorUpdateAlertType: AlertTypesConstant.OPTION
})
application.start({ moduleName: "main-page" });
