require("globals");
require("nativescript-i18n");

import { Observable } from "tns-core-modules/data/observable";
import * as app from "tns-core-modules/application";
import * as moment from "moment";
import * as appSettings from "tns-core-modules/application-settings";

import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { getVersionNameSync, getAppIdSync } from "nativescript-appversion";

import { UpdateTypesConstant, AlertTypesConstant, SystemConstants } from "./constants";
import { VersionHelper } from "./helpers";
import { IStoreUpdateConfig } from './interfaces'

declare var global: any;

export interface storeUpdateParams {
  majorUpdateAlertType    : number;
  minorUpdateAlertType    : number;
  patchUpdateAlertType    : number;
  revisionUpdateAlertType : number;
  notifyNbDaysAfterRelease: number;
  countryCode             : string;
}

export class StoreUpdateCommon {
  private _majorUpdateAlertType;
  private _minorUpdateAlertType;
  private _patchUpdateAlertType;
  private _revisionUpdateAlertType;
  private _notifyNbDaysAfterRelease;

  protected _countryCode  : string = 'en';
  protected _defaultConfig: IStoreUpdateConfig = {
    majorUpdateAlertType    : AlertTypesConstant.FORCE,
    minorUpdateAlertType    : AlertTypesConstant.OPTION,
    patchUpdateAlertType    : AlertTypesConstant.NONE,
    revisionUpdateAlertType : AlertTypesConstant.NONE,
    notifyNbDaysAfterRelease: 1,
  }

  constructor(config: IStoreUpdateConfig) {
    const conf = Object.assign({}, this._defaultConfig, config)
    this._majorUpdateAlertType     = conf.majorUpdateAlertType;
    this._minorUpdateAlertType     = conf.minorUpdateAlertType;
    this._patchUpdateAlertType     = conf.patchUpdateAlertType;
    this._revisionUpdateAlertType  = conf.revisionUpdateAlertType;
    this._notifyNbDaysAfterRelease = conf.notifyNbDaysAfterRelease;
    this._countryCode              = conf.countryCode;

    // Resumed is called both at launch and resume of the app
    app.on(app.resumeEvent, () => {
      this.checkForUpdate();
    })
  }

  /*
   *  Public
   */

  // Overwritten by platform versions
  public checkForUpdate() {}

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

  // Will be overriden
  protected _openStore() {}

  protected _setVersionAsSkipped(version: string) {
    appSettings.setString(SystemConstants.LAST_VERSION_SKIPPED_KEY, version);
  }

  protected _triggerAlertForUpdate(version: string) {
    this._showAlertForUpdate(version).then((confirmed: boolean) => {
      if (confirmed) this._openStore();
      else this._setVersionAsSkipped(version);
    });
  }

  protected _getAlertTypeForVersion(currentAppStoreVersion: string): number {
    let alertType = AlertTypesConstant.OPTION;

    const updateType = this._getUpdateTypeForVersion(currentAppStoreVersion);
    switch (updateType) {
      case UpdateTypesConstant.MAJOR: {
        alertType = this._majorUpdateAlertType;
        break;
      }
      case UpdateTypesConstant.MINOR: {
        alertType = this._minorUpdateAlertType;
        break;
      }
      case UpdateTypesConstant.PATCH: {
        alertType = this._patchUpdateAlertType;
        break;
      }
      case UpdateTypesConstant.REVISION: {
        alertType = this._revisionUpdateAlertType;
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

  protected _showAlertForUpdate(version: string): Promise<boolean> {
    const alertType = this._getAlertTypeForVersion(version);
    switch (alertType) {
      case AlertTypesConstant.FORCE: {
        const options: ConfirmOptions = this._buildDialogOptions({ skippable: false });
        return confirm(options);
      }
      case AlertTypesConstant.OPTION: {
        const options: ConfirmOptions = this._buildDialogOptions();
        return confirm(options);
      }
      default:
        return Promise.reject(null);
    }
  }

  /*
   *  Private
   */

  private _isAppStoreVersionNewer(storeVersion: string): boolean {
    if (storeVersion === null) return false;
    return VersionHelper.isHigher(storeVersion, this.localVersionNumber);
  }

  private _isCurrentVersionSkipped(currentAppStoreVersion: string): boolean {
    const lastVersionSkipped = appSettings.getString(SystemConstants.LAST_VERSION_SKIPPED_KEY);
    return currentAppStoreVersion === lastVersionSkipped;
  }

  private _hasBeenReleasedLongerThanDelay(releaseDate: string): boolean {
    if (releaseDate === null) return false;

    const daysSinceRelease = moment().diff(moment(new Date(releaseDate)), "days");
    if (daysSinceRelease < this._notifyNbDaysAfterRelease) {
      console.log(
        `Your app has been released for ${daysSinceRelease} days, but we cannot prompt the user until ${this
          ._notifyNbDaysAfterRelease} days have passed.`
      );
    }

    return daysSinceRelease >= this._notifyNbDaysAfterRelease;
  }

  private _isUpdateCompatibleWithDeviceOS(deviceVersion: string, minimumRequiredOSVersion: string): boolean {
    if (minimumRequiredOSVersion === null) return true;

    const isCompatible = VersionHelper.isEqualOrHigher(deviceVersion, minimumRequiredOSVersion);
    if (!isCompatible) console.log(`Device is incompatible with installed version of iOS.`);
    return isCompatible;
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
