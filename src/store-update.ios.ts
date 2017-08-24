import * as http from "tns-core-modules/http";
import * as utils from "tns-core-modules/utils/utils";
import { StoreUpdateCommon } from "./store-update.common";
import { IStoreUpdateConfig } from "./interfaces";

export * from "./constants";

declare const UIDevice: any;
const ITUNES_BASE_URL: string = "https://itunes.apple.com";

/**
 N.B - results:
   Used to contain all versions, but now only contains the latest version.
   Still returns an instance of Array.
 */

export interface AppleStoreInfos {
  resultCount: number;
  results: AppleStoreResult[];
}

export interface AppleStoreResult {
  bundleId: string;
  trackId: number;
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
    StoreUpdate._instance = this
  }

  public checkForUpdate() {
    console.log('IOS CHECK!')
    http
      .request({
        method: "GET",
        url: this._getItunesLookupUrl(),
        timeout: 2000
      })
      .then(result => {
        if (result.statusCode !== 200) {
          throw new Error(`Unexpected HTTP status code (${result.statusCode})`);
        }
        this._parseResults(result.content.toJSON());
      })
      .catch(e => console.dir(e));
  }

  /*
   *  Private
   */

  private _parseResults(data: AppleStoreInfos) {
    if (data.resultCount === 0) return;
    const result = Object.assign(data.results[0], { systemVersion: UIDevice.currentDevice.systemVersion });
    if (this._isEligibleForUpdate(result)) this._triggerAlertForUpdate(result.version);
  }

  private _triggerAlertForUpdate(version: string) {
    this._showAlertForUpdate(version).then((confirmed: boolean) => {
      if (confirmed) this._launchAppStore();
      else this._setVersionAsSkipped(version);
    });
  }

  private _launchAppStore() {
    // App Path
    utils.openUrl(
      NSURL.URLWithString(`itms-apps://itunes.com/app/${this.bundleId}`).absoluteString
    );
  }

  private _getItunesLookupUrl(): string {
    let url = `${ITUNES_BASE_URL}/lookup?bundleId=${this.bundleId}`;
    if (this._countryCode) {
      url = `${url}&country=${this._countryCode}`;
    }
    return url;
  }
}
