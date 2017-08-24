import "./bundle-config";
import * as application from 'tns-core-modules/application';
import { StoreUpdate, AlertTypesConstant } from "nativescript-store-update";

new StoreUpdate({
  notifyNbDaysAfterRelease: 0,
  majorUpdateAlertType: AlertTypesConstant.OPTION
});
application.start({ moduleName: "main-page" });
