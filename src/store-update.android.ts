import * as utils from "tns-core-modules/utils/utils";
import * as app from "tns-core-modules/application";

import { StoreUpdateCommon } from "./store-update.common";
import { GooglePlayHelper } from "./helpers";
import { IStoreUpdateConfig, IGoogleStoreResult } from './interfaces'

export * from "./constants";

app.on(app.resumeEvent, function () {
  StoreUpdate.checkForUpdate();
})

export class StoreUpdate extends StoreUpdateCommon {

  private static _checkHasTimeouted = false;
  private static _timeoutChecker;
  private static _looperChecker;

  public static checkForUpdate() {
    GooglePlayHelper.getAppInfos(StoreUpdate.getBundleId())
      .then(StoreUpdate._extendResults)
      .then(StoreUpdate._triggerAlertIfEligible.bind(StoreUpdate))
      .catch(console.error);
  }

  /*
   *  Private
   */

  private static _extendResults(result: IGoogleStoreResult) {
    return {
      version                  : result.version,
      currentVersionReleaseDate: result.date,
      minimumOsVersion         : result.os,
      systemVersion            : android.os.Build.VERSION.RELEASE
    };
  }

  private static _triggerAlertIfEligible(result) {
    if (StoreUpdate._isEligibleForUpdate(result)) StoreUpdate._triggerAlertForUpdate(result.version);
  }

  protected static _openStore() {
    const storeUrl = `market://details?id=${StoreUpdate.getBundleId()}`;
    utils.openUrl(storeUrl);
  }
}
