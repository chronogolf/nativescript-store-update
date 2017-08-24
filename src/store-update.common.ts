require("globals");
require("nativescript-i18n");

import { Observable } from "tns-core-modules/data/observable";
import * as app from "tns-core-modules/application";
import * as moment from "moment";
import * as appSettings from "tns-core-modules/application-settings";

import { ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { getVersionNameSync, getAppIdSync } from "nativescript-appversion";

import { VersionHelper } from "./helpers/version.helper";
import { AlertTypesConstant, UpdateTypesConstant } from "./constants";

declare var global: any;

export class StoreUpdateCommon {
  majorUpdateAlertType: number = AlertTypesConstant.FORCE;
  minorUpdateAlertType: number = AlertTypesConstant.OPTION;
  patchUpdateAlertType: number = AlertTypesConstant.NONE;
  revisionUpdateAlertType: number = AlertTypesConstant.NONE;

  notifyNbDaysAfterRelease: number = 3;

  countryCode: string;

  constructor() {}

  /*
   *  Public
   */

  get bundleId(): string {
    return getAppIdSync();
  }

  get localVersionNumber(): string {
    return getVersionNameSync();
  }

  /*
   *  Protected
   */

  protected _isEligibleForUpdate({ version, currentVersionReleaseDate, minimumOsVersion, systemVersion }): boolean {
    if (!this._isUpdateCompatibleWithDeviceOS(systemVersion, minimumOsVersion)) return false;
    if (!this._hasBeenReleasedLongerThanDelay(currentVersionReleaseDate)) return false;
    if (this._isCurrentVersionSkipped(version)) return false;
    if (!this._isAppStoreVersionNewer(version)) return false;
    return true;
  }

  protected _setVersionAsSkipped(version: string) {
    appSettings.setString("lastVersionSkipped", version);
  }

  protected _getAlertTypeForVersion(currentAppStoreVersion: string): number {
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

  protected _buildDialogOptions({ skippable = true } = {}): ConfirmOptions {
    let options = {
      title: "Update available",
      message: "A new version is available on the store",
      okButtonText: "Ok"
    };

    if (skippable) {
      options = (<any>Object).assign(options, { neutralButtonText: "Skip" });
    }
    return options;
  }

  /*
   *  Private
   */

  private _isAppStoreVersionNewer(versionsInStore: string): boolean {
    if (versionsInStore === null) return false;

    // return VersionHelper.isHigher(versionsInStore, this.localVersionNumber())
    return true; // Debug Purpose
  }

  private _isCurrentVersionSkipped(currentAppStoreVersion: string): boolean {
    const lastVersionSkipped = appSettings.getString("lastVersionSkipped");
    return currentAppStoreVersion === lastVersionSkipped;
  }

  private _hasBeenReleasedLongerThanDelay(releaseDate: string): boolean {
    if (releaseDate === null) return false;

    const daysSinceRelease = moment().diff(moment(releaseDate), "days");
    if (daysSinceRelease < this.notifyNbDaysAfterRelease) {
      console.log(
        `Your app has been released for ${daysSinceRelease} days, but we cannot prompt the user until ${this
          .notifyNbDaysAfterRelease} days have passed.`
      );
    }

    return daysSinceRelease >= this.notifyNbDaysAfterRelease;
  }

  private _isUpdateCompatibleWithDeviceOS(deviceVersion: string, minimumRequiredOSVersion: string): boolean {
    if (minimumRequiredOSVersion === null) return true;
    if (!VersionHelper.isEqualOrHigher(deviceVersion, minimumRequiredOSVersion)) {
      console.log(`Device is incompatible with installed version of iOS.`);
    }
    return VersionHelper.isEqualOrHigher(deviceVersion, minimumRequiredOSVersion);
  }

  private _getUpdateTypeForVersion(currentAppStoreVersion: string): number {
    if (VersionHelper.isMajorUpdate(currentAppStoreVersion, this.localVersionNumber)) return UpdateTypesConstant.MAJOR;

    if (VersionHelper.isMinorUpdate(currentAppStoreVersion, this.localVersionNumber)) return UpdateTypesConstant.MINOR;

    if (VersionHelper.isPatchUpdate(currentAppStoreVersion, this.localVersionNumber)) return UpdateTypesConstant.PATCH;

    if (VersionHelper.isRevisionUpdate(currentAppStoreVersion, this.localVersionNumber))
      return UpdateTypesConstant.REVISION;

    return -1;
  }
}
