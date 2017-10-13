require('./assign.helper')

import * as moment from 'moment'
import * as app from 'tns-core-modules/application'
import * as appSettings from 'tns-core-modules/application-settings'
import { Observable } from 'tns-core-modules/data/observable'
import { device } from 'tns-core-modules/platform'

import { getAppIdSync, getVersionCodeSync, getVersionNameSync } from 'nativescript-appversion'
import { confirm, ConfirmOptions } from 'tns-core-modules/ui/dialogs'

import { AlertTypesConstants, UpdateTypesConstants } from './constants'
import { LocalesHelper, VersionHelper } from './helpers'
import { IStoreUpdateConfig } from './interfaces'

declare var global: any
const LAST_VERSION_SKIPPED_KEY = 'lastVersionSkipped'
const defaultConfig: IStoreUpdateConfig = {
  countryCode: 'en',
  majorUpdateAlertType: AlertTypesConstants.FORCE,
  minorUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 1,
  patchUpdateAlertType: AlertTypesConstants.NONE,
  revisionUpdateAlertType: AlertTypesConstants.NONE,
}

export class StoreUpdateCommon {
  static instatiated = false

  protected static _countryCode

  private static _majorUpdateAlertType
  private static _minorUpdateAlertType
  private static _patchUpdateAlertType
  private static _revisionUpdateAlertType
  private static _notifyNbDaysAfterRelease

  /*
   *  Public
   */

  static init(config: IStoreUpdateConfig) {
    if (this.instatiated) return
    const conf = {
      ...defaultConfig,
      ...config,
    }
    this.instatiated = true
    this._majorUpdateAlertType = conf.majorUpdateAlertType
    this._minorUpdateAlertType = conf.minorUpdateAlertType
    this._patchUpdateAlertType = conf.patchUpdateAlertType
    this._revisionUpdateAlertType = conf.revisionUpdateAlertType
    this._notifyNbDaysAfterRelease = conf.notifyNbDaysAfterRelease
    this._countryCode = conf.countryCode
    LocalesHelper.changeLang(device.language)
  }

  static getBundleId(): string {
    return getAppIdSync()
  }

  static getLocalVersionNumber(): string {
    return `${getVersionNameSync()}.${getVersionCodeSync()}`
  }

  /*
   *  Protected
   */

  protected static _isEligibleForUpdate({
    version,
    currentVersionReleaseDate,
    minimumOsVersion,
    systemVersion,
  }): boolean {
    if (!this._isUpdateCompatibleWithDeviceOS(systemVersion, minimumOsVersion)) return false
    if (!this._hasBeenReleasedLongerThanDelay(currentVersionReleaseDate)) return false
    if (this._isCurrentVersionSkipped(version)) return false
    if (!this._isAppStoreVersionNewer(version)) return false
    return true
  }

  protected static _openStore() {
    // Overriden by platforms
  }

  protected static _setVersionAsSkipped(version: string) {
    appSettings.setString(LAST_VERSION_SKIPPED_KEY, version)
  }

  protected static _triggerAlertForUpdate(version: string) {
    return this._showAlertForUpdate(version).then((confirmed: boolean) => {
      if (confirmed) this._openStore()
      else this._setVersionAsSkipped(version)
    })
  }

  protected static _getAlertTypeForVersion(currentAppStoreVersion: string): number {
    const updateType = this._getUpdateTypeForVersion(currentAppStoreVersion)

    switch (updateType) {
      case UpdateTypesConstants.MAJOR: {
        return this._majorUpdateAlertType
      }
      case UpdateTypesConstants.MINOR: {
        return this._minorUpdateAlertType
      }
      case UpdateTypesConstants.PATCH: {
        return this._patchUpdateAlertType
      }
      case UpdateTypesConstants.REVISION: {
        return this._revisionUpdateAlertType
      }
      default:
        return AlertTypesConstants.OPTION
    }
  }

  protected static _buildDialogOptions({ skippable = true } = {}): ConfirmOptions {
    let options = {
      message: LocalesHelper.translate('ALERT_MESSAGE'),
      neutralButtonText: null,
      okButtonText: LocalesHelper.translate('ALERT_UPDATE_BUTTON'),
      title: LocalesHelper.translate('ALERT_TITLE'),
    }

    if (skippable) {
      options = {
        ...options,
        neutralButtonText: LocalesHelper.translate('ALERT_SKIP_BUTTON'),
      }
    }
    return options
  }

  protected static _showAlertForUpdate(version: string): Promise<boolean> {
    const alertType = this._getAlertTypeForVersion(version)
    switch (alertType) {
      case AlertTypesConstants.FORCE: {
        const options: ConfirmOptions = this._buildDialogOptions({ skippable: false })
        return confirm(options)
      }
      case AlertTypesConstants.OPTION: {
        const options: ConfirmOptions = this._buildDialogOptions()
        return confirm(options)
      }
      default:
        return Promise.reject(null)
    }
  }

  protected static _triggerAlertIfEligible(result) {
    if (this._isEligibleForUpdate(result)) {
      this._triggerAlertForUpdate(result.version)
    }
  }

  /*
   *  Private
   */

  private static _isAppStoreVersionNewer(storeVersion: string): boolean {
    if (storeVersion === null) return false
    return VersionHelper.isHigher(storeVersion, this.getLocalVersionNumber())
  }

  private static _isCurrentVersionSkipped(currentAppStoreVersion: string): boolean {
    const lastVersionSkipped = appSettings.getString(LAST_VERSION_SKIPPED_KEY)
    return currentAppStoreVersion === lastVersionSkipped
  }

  private static _hasBeenReleasedLongerThanDelay(releaseDate: string): boolean {
    if (releaseDate === null) return false

    const daysSinceRelease = moment().diff(moment(new Date(releaseDate)), 'days')
    if (daysSinceRelease < this._notifyNbDaysAfterRelease) {
      console.log(
        `Your app has been released for ${daysSinceRelease} days,
        but we cannot prompt the user until
        ${this._notifyNbDaysAfterRelease} days have passed.`
      )
    }

    return daysSinceRelease >= this._notifyNbDaysAfterRelease
  }

  private static _isUpdateCompatibleWithDeviceOS(
    deviceVersion: string,
    minimumRequiredOSVersion: string
  ): boolean {
    if (minimumRequiredOSVersion === null) return true

    const isCompatible = VersionHelper.isEqualOrHigher(deviceVersion, minimumRequiredOSVersion)
    if (!isCompatible) console.log(`Device is incompatible with installed version of iOS.`)
    return isCompatible
  }

  private static _getUpdateTypeForVersion(currentAppStoreVersion: string): number {
    const localVersion = this.getLocalVersionNumber()
    if (VersionHelper.isMajorUpdate(currentAppStoreVersion, localVersion)) {
      return UpdateTypesConstants.MAJOR
    }

    if (VersionHelper.isMinorUpdate(currentAppStoreVersion, localVersion)) {
      return UpdateTypesConstants.MINOR
    }

    if (VersionHelper.isPatchUpdate(currentAppStoreVersion, localVersion)) {
      return UpdateTypesConstants.PATCH
    }

    if (VersionHelper.isRevisionUpdate(currentAppStoreVersion, localVersion)) {
      return UpdateTypesConstants.REVISION
    }

    return -1
  }
}
