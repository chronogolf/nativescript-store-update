import * as http from "tns-core-modules/http";
import * as utils from "tns-core-modules/utils/utils";
import { StoreUpdateCommon } from "./store-update.common";
import { IStoreUpdateConfig, AppleStoreResult } from "./interfaces";
import { AppStoreHelper } from "./helpers";

export * from "./constants";

export class StoreUpdate extends StoreUpdateCommon {
  private static _instance: StoreUpdate;

  constructor(config: IStoreUpdateConfig) {
    if (StoreUpdate._instance instanceof StoreUpdate) {
      return StoreUpdate._instance;
    }
    super(config);
    StoreUpdate._instance = this
  }

  public checkForUpdate() {
    AppStoreHelper.getAppInfos(this.bundleId, this._countryCode)
      .then(this._extendResults)
      .then(this._triggerAlertIfEligible.bind(this))
      .catch(e => console.error(e));
  }

  /*
   *  Private
   */

  private _extendResults(result: AppleStoreResult) {
    return Object.assign(
      {},
      result,
      { systemVersion: UIDevice.currentDevice.systemVersion }
    );
  }

  private _triggerAlertIfEligible(result) {
    if (this._isEligibleForUpdate(result)) this._triggerAlertForUpdate(result.version)
  }

  protected _openStore() {
    // App Path
    utils.openUrl(
      NSURL.URLWithString(`itms-apps://itunes.com/app/${this.bundleId}`).absoluteString
    );
  }
}
