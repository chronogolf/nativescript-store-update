var http = require("http");
var utils = require("utils/utils");

import { StoreUpdateCommon } from "./store-update.common";

declare const UIDevice: any;

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

export * from "./constants";

const ITUNES_BASE_URL: string = "https://itunes.apple.com";

export class StoreUpdate extends StoreUpdateCommon {
  constructor() {
    super();
  }

  init(initParams: any) {
    super.init(initParams);
  }

  public checkForUpdate() {
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
    utils.openUrl(NSURL.URLWithString(`itms-apps://itunes.com/app/${this.bundleId}`));
  }

  private _getItunesLookupUrl(): string {
    let url = `${ITUNES_BASE_URL}/lookup?bundleId=${this.bundleId}`;
    if (this.countryCode) {
      url = `${url}&country=${this.countryCode}`;
    }
    return url;
  }
}
