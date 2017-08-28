import "./bundle-config";
import * as application from "tns-core-modules/application";
import { StoreUpdate, AlertTypesConstants } from "nativescript-store-update";

StoreUpdate.init({
  notifyNbDaysAfterRelease: 1,
  majorUpdateAlertType: AlertTypesConstants.OPTION
})
application.start({ moduleName: "main-page" });
