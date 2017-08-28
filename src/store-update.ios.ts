import * as app from "tns-core-modules/application";
import * as http from "tns-core-modules/http";
import * as utils from "tns-core-modules/utils/utils";
import { StoreUpdateCommon } from "./store-update.common";
import { IStoreUpdateConfig, AppleStoreResult } from "./interfaces";
import { AppStoreHelper } from "./helpers";

export * from "./constants";

class ForegroundDelegage extends UIResponder implements UIApplicationDelegate {
  public static ObjCProtocols = [UIApplicationDelegate];

  applicationDidFinishLaunchingWithOptions(): boolean {
    StoreUpdate.checkForUpdate();
    return true
  }

  applicationWillEnterForeground(): void {
    StoreUpdate.checkForUpdate();
  }
}
app.ios.delegate = ForegroundDelegage

export class StoreUpdate extends StoreUpdateCommon {

  public static checkForUpdate() {
    AppStoreHelper.getAppInfos(StoreUpdate.getBundleId(), StoreUpdate._countryCode)
      .then(StoreUpdate._extendResults)
      .then(StoreUpdate._triggerAlertIfEligible)
      .catch(e => console.error(e));
  }

  /*
   *  Private
   */

  private static _extendResults(result: AppleStoreResult) {
    return Object.assign(
      {},
      result,
      { systemVersion: UIDevice.currentDevice.systemVersion }
    );
  }

  private static _triggerAlertIfEligible(result) {
    if (StoreUpdate._isEligibleForUpdate(result)) StoreUpdate._triggerAlertForUpdate(result.version)
  }

  protected static _openStore() {
    // App Path
    utils.openUrl(
      NSURL.URLWithString(`itms-apps://itunes.com/app/${StoreUpdate.getBundleId()}`).absoluteString
    );
  }
}
