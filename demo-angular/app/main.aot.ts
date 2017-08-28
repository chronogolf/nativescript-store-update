// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScript } from "nativescript-angular/platform-static";
import { StoreUpdate } from "nativescript-store-update";
import { AppModuleNgFactory } from "./app.module.ngfactory";

StoreUpdate.init({
  notifyNbDaysAfterRelease: 1
})
platformNativeScript().bootstrapModuleFactory(AppModuleNgFactory);
