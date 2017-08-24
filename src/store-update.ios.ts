var http = require("http");
var utils = require("utils/utils");

import { confirm } from "tns-core-modules/ui/dialogs";

import { StoreUpdateCommon } from "./store-update.common";
import { VersionHelper } from "./helpers/version.helper";
import { AlertTypesConstant } from "./constants";

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
const BUNDLE_ID: string = "com.chronogolf.booking.chronogolf";

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
      .catch(err => {
        console.warn("Failed Request");
        console.dir(err);
      });
  }

  /*
   *  Private
   */

  private _parseResults(data: AppleStoreInfos) {
    if (data.resultCount === 0) return;
    const result = Object.assign(data.results[0], { systemVersion: UIDevice.currentDevice.systemVersion });
    if (this._isEligibleForUpdate(result)) this._showAlertForUpdate(result);
  }

  private _showAlertForUpdate(result: AppleStoreResult) {
    // Show Appropriate Alert Dialog
    const alertType = this._getAlertTypeForVersion("2.1.3"); // result.version
    switch (alertType) {
      case AlertTypesConstant.FORCE: {
        const options = this._buildDialogOptions({ skippable: false });
        confirm(options).then((confirmed: boolean) => {
          if (confirmed) this._launchAppStore(result.trackId);
        });
        break;
      }
      case AlertTypesConstant.OPTION: {
        const options = this._buildDialogOptions();
        confirm(options).then((confirmed: boolean) => {
          if (confirmed) this._launchAppStore(result.trackId);
          this._setVersionAsSkipped(result.version);
        });
        break;
      }
      default:
        break;
    }
  }

  private _launchAppStore(appId: number) {
    const appStoreUrl = `${ITUNES_BASE_URL}/app?id=${appId}`;

    // Web Path
    utils.openUrl(appStoreUrl);

    // App Path
    // utils.openUrl(NSURL.URLWithString(`itms-apps://itunes.com/app/${this.bundleId}`))
  }

  private _getItunesLookupUrl(): string {
    let url = `${ITUNES_BASE_URL}/lookup?bundleId=${BUNDLE_ID}`;
    if (this.countryCode) {
      url = `${url}&country=${this.countryCode}`;
    }
    return url;
  }
}
