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
import { IStoreUpdateConfig, AlertOptions } from './interfaces'

declare var global: any
const LAST_VERSION_SKIPPED_KEY = 'lastVersionSkipped'
const defaultConfig: IStoreUpdateConfig = {
  countryCode: 'en',
  majorUpdateAlertType: AlertTypesConstants.FORCE,
  minorUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 1,
  patchUpdateAlertType: AlertTypesConstants.NONE,
  revisionUpdateAlertType: AlertTypesConstants.NONE,
  alertOptions: null,
  onConfirmed: () => console.log('User confirmed!'),
}

export class StoreUpdateCommon {
  countryCode

  private _majorUpdateAlertType
  private _minorUpdateAlertType
  private _patchUpdateAlertType
  private _revisionUpdateAlertType
  private _notifyNbDaysAfterRelease
  private _onConfirmed
  private _alertOptions: AlertOptions

  constructor(config?: IStoreUpdateConfig) {
    if (config) this._init(config)
  }

  /*
   *  Public
   */

  getBundleId(): string {
    return getAppIdSync()
  }

  getLocalVersionNumber(): string {
    return `${getVersionNameSync()}.${getVersionCodeSync()}`
  }

  isEligibleForUpdate({
    version,
    currentVersionReleaseDate,
    minimumOsVersion,
    systemVersion,
  }): boolean {
    if (!this._isUpdateCompatibleWithDeviceOS(systemVersion, minimumOsVersion)) {
      return false
    }
    if (!this._hasBeenReleasedLongerThanDelay(currentVersionReleaseDate)) return false
    if (this._isCurrentVersionSkipped(version)) return false
    if (!this._isAppStoreVersionNewer(version)) return false
    return true
  }

  setVersionAsSkipped(version: string) {
    appSettings.setString(LAST_VERSION_SKIPPED_KEY, version)
  }

  triggerAlertForUpdate(version: string) {
    return this.showAlertForUpdate(version).then((confirmed: boolean) => {
      if (confirmed) this._onConfirmed()
      else this.setVersionAsSkipped(version)
    })
  }

  getAlertTypeForVersion(currentAppStoreVersion: string): number {
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

  buildDialogOptions({ skippable = true } = {}): ConfirmOptions {
    let options = {
      title: this._getMessage('title', 'ALERT_TITLE'),
      message: this._getMessage('message', 'ALERT_MESSAGE'),
      neutralButtonText: null,
      okButtonText: this._getMessage('updateButton', 'ALERT_UPDATE_BUTTON'),
    }

    if (skippable) {
      options = {
        ...options,
        neutralButtonText: this._getMessage('skipButton', 'ALERT_SKIP_BUTTON'),
      }
    }

    return options
  }

  private _getMessage(alertOptionKey: string, fallbackTranslateKey: string): string {
    return this._hasValidAlertOptionEntry(alertOptionKey) ? this._alertOptions[alertOptionKey] : LocalesHelper.translate(fallbackTranslateKey)
  }

  private _hasValidAlertOptionEntry(key) {
    if (!this._alertOptions) return false
    return this._alertOptions.hasOwnProperty(key) && this._alertOptions[key] !== ''
  }

  showAlertForUpdate(version: string): Promise<boolean> {
    const alertType = this.getAlertTypeForVersion(version)
    switch (alertType) {
      case AlertTypesConstants.FORCE: {
        const options: ConfirmOptions = this.buildDialogOptions({ skippable: false })
        return confirm(options)
      }
      case AlertTypesConstants.OPTION: {
        const options: ConfirmOptions = this.buildDialogOptions()
        return confirm(options)
      }
      default:
        return Promise.reject(null)
    }
  }

  triggerAlertIfEligible(result) {
    if (this.isEligibleForUpdate(result)) {
      this.triggerAlertForUpdate(result.version)
    }
  }

  /*
   *  Private
   */

  private _init(config: IStoreUpdateConfig) {
    const conf = {
      ...defaultConfig,
      ...config,
    }

    this._majorUpdateAlertType = conf.majorUpdateAlertType
    this._minorUpdateAlertType = conf.minorUpdateAlertType
    this._patchUpdateAlertType = conf.patchUpdateAlertType
    this._revisionUpdateAlertType = conf.revisionUpdateAlertType
    this._notifyNbDaysAfterRelease = conf.notifyNbDaysAfterRelease
    this.countryCode = conf.countryCode
    this._onConfirmed = conf.onConfirmed
    this._alertOptions = conf.alertOptions

    LocalesHelper.changeLang(device.language)
  }

  private _isAppStoreVersionNewer(storeVersion: string): boolean {
    if (storeVersion === null) return false
    return VersionHelper.isHigher(storeVersion, this.getLocalVersionNumber())
  }

  private _isCurrentVersionSkipped(currentAppStoreVersion: string): boolean {
    const lastVersionSkipped = appSettings.getString(LAST_VERSION_SKIPPED_KEY)
    return currentAppStoreVersion === lastVersionSkipped
  }

  private _hasBeenReleasedLongerThanDelay(releaseDate: string): boolean {
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

  private _isUpdateCompatibleWithDeviceOS(
    deviceVersion: string,
    minimumRequiredOSVersion: string
  ): boolean {
    if (minimumRequiredOSVersion === null) return true

    const isCompatible = VersionHelper.isEqualOrHigher(deviceVersion, minimumRequiredOSVersion)
    if (!isCompatible) console.log(`Device is incompatible with installed version of iOS.`)
    return isCompatible
  }

  private _getUpdateTypeForVersion(currentAppStoreVersion: string): number {
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
