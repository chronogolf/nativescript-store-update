require("globals");
require("nativescript-i18n");
var http = require("http");
var utils = require("utils/utils");

import * as appSettings from "tns-core-modules/application-settings";
import * as moment from "moment";
import * as dialogs from "tns-core-modules/ui/dialogs";

import { StoreUpdateCommon } from "./store-update.common";
import { VersionHelper } from "./helpers/version.helper";
import { LocalesConstant, AlertTypesConstant, UpdateTypesConstant } from "./constants";

declare const NSBundle: any;
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

export class StoreUpdate extends StoreUpdateCommon {
  private ITUNES_BASE_URL: string = "https://itunes.apple.com";
  private BUNDLE_ID: string = "com.chronogolf.booking.chronogolf";

  // lastVersionCheckPerformedOnDate: date

  constructor() {
    super();
    this.checkForUpdate();
  }

  get localVersionNumber(): string {
    return NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleShortVersionString");
  }

  public checkForUpdate() {
    console.log(L("alert_title"));

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

    const result: AppleStoreResult = data.results[0];

    if (this._isUpdateCompatibleWithDeviceOS(result)) {
      /**
       Checks to see when the latest version of the app was released.
       If the release date is greater-than-or-equal-to `notifyNbDaysAfterRelease`,
       user will prompted to update their app.
       */

      if (this._hasBeenReleasedLongerThanDelay(result)) return;

      /**
       Current version that has been uploaded to the AppStore.
       */

      if (this._isAppStoreVersionNewer(result)) {
        this._setupNotificationForUpdate(result);
      }
    } else {
      console.log(`Device is incompatible with installed version of iOS.`);
    }
  }

  private _isUpdateCompatibleWithDeviceOS(result: AppleStoreResult): boolean {
    const requiredOSVersion = result.minimumOsVersion;
    if (requiredOSVersion === null) return true;

    return VersionHelper.isEqualOrHigher(UIDevice.currentDevice.systemVersion, requiredOSVersion);
  }

  private _hasBeenReleasedLongerThanDelay(result: AppleStoreResult): boolean {
    const lastVersionCheckPerformedOnDate = moment().format();
    // appSettings.setString('lastVersionCheckPerformedOnDate', lastVersionCheckPerformedOnDate)

    const releaseDateString = result.currentVersionReleaseDate;
    if (releaseDateString === null) return false;

    const daysSinceRelease = moment(lastVersionCheckPerformedOnDate).diff(moment(releaseDateString), "days");

    console.log(`days since release => ${daysSinceRelease}`);
    if (!(daysSinceRelease >= this.notifyNbDaysAfterRelease)) {
      console.log(
        `Your app has been released for ${daysSinceRelease} days, but we cannot prompt the user until ${this
          .notifyNbDaysAfterRelease} days have passed.`
      );
    }

    return this.notifyNbDaysAfterRelease >= daysSinceRelease;
  }

  private _isAppStoreVersionNewer(result: AppleStoreResult): boolean {
    const versionsInAppStore = result.version;
    if (versionsInAppStore === null) return false;

    // return VersionHelper.isHigher(versionsInAppStore, this.localVersionNumber())
    return true; // Debug Purpose
  }

  private _setupNotificationForUpdate(result: AppleStoreResult) {
    this._showAlertIfCurrentAppStoreVersionNotSkipped(result);
  }

  private _showAlertIfCurrentAppStoreVersionNotSkipped(result: AppleStoreResult) {
    // Check if user decided to skip this version in the past
    if (this._isCurrentVersionSkipped(result.version)) return;
    this._showAlertForAppStoreVersion(result);
  }

  private _isCurrentVersionSkipped(currentAppStoreVersion: string): boolean {
    const lastVersionSkipped = appSettings.getString("lastVersionSkipped");
    return currentAppStoreVersion === lastVersionSkipped;
  }

  private _showAlertForAppStoreVersion(result: AppleStoreResult) {
    // Show Appropriate Alert Dialog
    const alertType = this._getAlertTypeForVersion("2.1.3"); // result.version
    switch (alertType) {
      case AlertTypesConstant.FORCE: {
        const options = this._buildDialogOptions({ skippable: false });
        dialogs.confirm(options).then((confirmed: boolean) => {
          if (confirmed) this._launchAppStore(result.trackId);
        });
        break;
      }
      case AlertTypesConstant.OPTION: {
        const options = this._buildDialogOptions();
        dialogs.confirm(options).then((confirmed: boolean) => {
          if (confirmed) this._launchAppStore(result.trackId);
        });
        break;
      }
      default:
        break;
    }
  }

  private _getUpdateTypeForVersion(currentAppStoreVersion): number {
    if (VersionHelper.isMajorUpdate(currentAppStoreVersion, this.localVersionNumber)) return UpdateTypesConstant.MAJOR;

    if (VersionHelper.isMinorUpdate(currentAppStoreVersion, this.localVersionNumber)) return UpdateTypesConstant.MINOR;

    if (VersionHelper.isPatchUpdate(currentAppStoreVersion, this.localVersionNumber)) return UpdateTypesConstant.PATCH;

    if (VersionHelper.isRevisionUpdate(currentAppStoreVersion, this.localVersionNumber))
      return UpdateTypesConstant.REVISION;

    return -1;
  }

  private _getAlertTypeForVersion(currentAppStoreVersion): number {
    let alertType = AlertTypesConstant.OPTION;

    const updateType = this._getUpdateTypeForVersion(currentAppStoreVersion);
    switch (updateType) {
      case UpdateTypesConstant.MAJOR: {
        alertType = this.majorUpdateAlertType;
        break;
      }
      case UpdateTypesConstant.MINOR: {
        alertType = this.minorUpdateAlertType;
        break;
      }
      case UpdateTypesConstant.PATCH: {
        alertType = this.patchUpdateAlertType;
        break;
      }
      case UpdateTypesConstant.REVISION: {
        alertType = this.revisionUpdateAlertType;
        break;
      }
      default:
        break;
    }

    return alertType;
  }

  private _buildDialogOptions({ skippable = true } = {}): dialogs.ConfirmOptions {
    let options = {
      title: L("alert_title"),
      message: L("alert_message"),
      okButtonText: L("alert_update_button")
    };

    if (skippable)
      options = Object.assign(options, {
        neutralButtonText: L("alert_skip_button")
      });
    return options;
  }

  private _launchAppStore(appId: number) {
    const appStoreUrl = `${this.ITUNES_BASE_URL}/app?id=${appId}`;

    // Web Path
    utils.openUrl(appStoreUrl);

    // App Path
    // utils.openUrl((NSURL.URLWithString(`itms-apps://itunes.com/app/${this.BUNDLE_ID}`))
  }

  private _getItunesLookupUrl(): string {
    let url = `${this.ITUNES_BASE_URL}/lookup?bundleId=${this.BUNDLE_ID}`;
    if (this.countryCode) {
      url = `${url}&country=${this.countryCode}`;
    }
    return url;
  }
}
