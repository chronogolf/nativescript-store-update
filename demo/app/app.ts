import "./bundle-config";
import * as application from 'tns-core-modules/application';
import { StoreUpdate } from "nativescript-store-update";

new StoreUpdate({});
application.start({ moduleName: "main-page" });
