import * as utils from "tns-core-modules/utils/utils";

import { StoreUpdateCommon } from "./store-update.common";
import { GooglePlayHelper } from "./helpers";
import { IStoreUpdateConfig } from './interfaces'

export * from "./constants";

declare const android: any;

export interface GoogleStoreResult {
  version: string;
  minimumOsVersion: string;
  currentVersionReleaseDate: string;
}

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
      .then((infos: GoogleStoreResult) => {
        this._parseResults(infos)
      })
      .catch(console.error);
  }

  /*
   *  Private
   */

  private _parseResults(result: any) {
    const data = {
      version                  : result.version,
      currentVersionReleaseDate: result.date,
      minimumOsVersion         : result.os,
      systemVersion            : android.os.Build.VERSION.RELEASE
    };
    if (this._isEligibleForUpdate(data)) this._triggerAlertForUpdate(result.version);
  }

  private _triggerAlertForUpdate(version: string) {
    this._showAlertForUpdate(version).then((confirmed: boolean) => {
      if (confirmed) this._launchPlayStore();
      else this._setVersionAsSkipped(version);
    });
  }

  private _launchPlayStore() {
    const storeUrl = `market://details?id=${this.bundleId}`;
    utils.openUrl(storeUrl);
  }
}
