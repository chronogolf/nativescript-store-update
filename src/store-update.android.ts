import * as utils from "tns-core-modules/utils/utils";

import { StoreUpdateCommon } from "./store-update.common";
import { GooglePlayHelper } from "./helpers";
import { IStoreUpdateConfig, GoogleStoreResult } from './interfaces'

export * from "./constants";

export class StoreUpdate extends StoreUpdateCommon {
  private static _instance: StoreUpdate;

  constructor(config: IStoreUpdateConfig) {
    if (StoreUpdate._instance instanceof StoreUpdate) {
      return StoreUpdate._instance;
    }
    super(config);
    StoreUpdate._instance = this;
  }

  checkForUpdate() {
    GooglePlayHelper.getAppInfos(this.bundleId)
      .then(this._extendResults)
      .then(this._triggerAlertIfEligible.bind(this))
      .catch(console.error);
  }

  /*
   *  Private
   */

  private _extendResults(result: GoogleStoreResult) {
    return {
      version                  : result.version,
      currentVersionReleaseDate: result.date,
      minimumOsVersion         : result.os,
      systemVersion            : android.os.Build.VERSION.RELEASE
    };
  }

  private _triggerAlertIfEligible(result) {
    if (this._isEligibleForUpdate(result)) this._triggerAlertForUpdate(result.version);
  }

  protected _openStore() {
    const storeUrl = `market://details?id=${this.bundleId}`;
    utils.openUrl(storeUrl);
  }
}
