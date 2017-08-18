import * as appSettings from 'tns-core-modules/application-settings';
import * as moment from 'moment';
import * as dialogs from 'tns-core-modules/ui/dialogs';

import { Common } from './store-update.common';
import { LocalesConstant } from './constants/locales'
import { VersionHelper } from './helpers/version.helper'

var http = require('http')
var utils = require('utils/utils')

declare const NSBundle: any
declare const UIDevice: any

const UPDATE_TYPES = {
  MAJOR: 1,
  MINOR: 2,
  PATCH: 3,
  REVISION: 4
}

const ALERT_TYPES = {
  FORCE  : 1,
  OPTION : 2,
  NONE   : 3
}

/**
 results:
   Used to contain all versions, but now only contains the latest version.
   Still returns an instance of Array.
 */
export interface AppleStoreInfos {
  resultCount: number,
  results: AppleStoreResult[]
}

export interface AppleStoreResult {
  bundleId: string,
  trackId : number,
  version : string,
  releaseDate: string,
  minimumOsVersion: string,
  currentVersionReleaseDate: string
}

export class StoreUpdate extends Common {

  private ITUNES_BASE_URL: string = 'https://itunes.apple.com'
  private BUNDLE_ID: string = 'com.chronogolf.booking.chronogolf'

  private _majorUpdateAlertType: number
  private _minorUpdateAlertType: number
  private _patchUpdateAlertType: number
  private _revisionUpdateAlertType: number


  // lastVersionCheckPerformedOnDate: date
  appID: string
  updateAvailableMessage: string
  countryCode: string // = LocalesConstant.French

  notifyNbDaysAfterRelease: number = 3

  constructor() {
    super();
    this.checkForUpdate();
  }

  public localVersionNumber() {
    return NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleShortVersionString");
  }

  public checkForUpdate() {
    const itunesLookupUrl = this._getItunesLookupUrl()

    http.request({
      method: "GET",
      url: itunesLookupUrl,
      timeout: 2000
    })
    .then(result => {
      if (result.statusCode !== 200) {
        throw new Error(`Unexpected HTTP status code (${result.statusCode})`);
      }
      this._parseResults(result.content.toJSON())
    })
    .catch(err => {
      console.warn("Failed Request");
      console.dir(err)
    });
  }

  /*
   *  Private
   */

  private _isUpdateCompatibleWithDeviceOS(result: AppleStoreResult): boolean {
    const requiredOSVersion = result.minimumOsVersion
    if (requiredOSVersion === null) return true

    return VersionHelper.isEqualOrHigher(UIDevice.currentDevice.systemVersion, requiredOSVersion)
  }

  private _hasBeenReleasedLongerThanDelay(result: AppleStoreResult): boolean {
    const lastVersionCheckPerformedOnDate = moment().format()
      // appSettings.setString('lastVersionCheckPerformedOnDate', lastVersionCheckPerformedOnDate)

    const releaseDateString = result.currentVersionReleaseDate
    if (releaseDateString === null) return false

    const daysSinceRelease = moment(lastVersionCheckPerformedOnDate).diff(moment(releaseDateString), 'days')

    console.log(`days since release => ${daysSinceRelease}`)
    if (!(daysSinceRelease >= this.notifyNbDaysAfterRelease)) {
      console.log(`Your app has been released for ${daysSinceRelease} days, but we cannot prompt the user until ${this.notifyNbDaysAfterRelease} days have passed.`)
    }

    return daysSinceRelease >= this.notifyNbDaysAfterRelease
  }

  private _isAppStoreVersionNewer(result: AppleStoreResult): boolean {
    const versionsInAppStore = result.version
    if (versionsInAppStore === null) return false

    console.log(`localVersion => ${this.localVersionNumber()}, versionsInAppStore => ${versionsInAppStore}`)

    // return VersionHelper.isHigher(currentAppStoreVersion, this.localVersionNumber())
    return true // Debug Purpose
  }

  private _parseResults(data: AppleStoreInfos) {
    if (data.resultCount === 0) return

    const result: AppleStoreResult = data.results[0]

    if (this._isUpdateCompatibleWithDeviceOS(result)) {
      /**
       Checks to see when the latest version of the app was released.
       If the release date is greater-than-or-equal-to `notifyNbDaysAfterRelease`,
       user will prompted to update their app.
       */

      if (this._hasBeenReleasedLongerThanDelay(result)) return

      /**
       Current version that has been uploaded to the AppStore.
       */

      if (this._isAppStoreVersionNewer(result)) {
        this._setupNotificationForUpdate(result)
      } else {
        console.log(`Current Version is up-to-date`)
      }
    } else {
      console.log(`Device is incompatible with installed version of iOS.`)
    }
  }

  private _setupNotificationForUpdate(result: AppleStoreResult) {
    // TODO: localize [self localizeAlertStringsForCurrentAppStoreVersion:currentAppStoreVersion];

    this._showAlertIfCurrentAppStoreVersionNotSkipped(result)
  }

  private _showAlertIfCurrentAppStoreVersionNotSkipped(result: AppleStoreResult) {
    // Check if user decided to skip this version in the past
    if (this._isCurrentVersionSkipped(result.version)) return
    this._showAlertForAppStoreVersion(result)
  }

  private _isCurrentVersionSkipped(currentAppStoreVersion: string): boolean {
    const lastVersionSkipped = appSettings.getString('lastVersionSkipped')
    return currentAppStoreVersion === lastVersionSkipped
  }

  private _getUpdateTypeForVersion(currentAppStoreVersion): number {
    if (VersionHelper.isMajorUpdate(currentAppStoreVersion, this.localVersionNumber()))
      return UPDATE_TYPES.MAJOR

    if (VersionHelper.isMinorUpdate(currentAppStoreVersion, this.localVersionNumber()))
      return UPDATE_TYPES.MINOR

    if (VersionHelper.isPatchUpdate(currentAppStoreVersion, this.localVersionNumber()))
      return UPDATE_TYPES.PATCH

    if (VersionHelper.isRevisionUpdate(currentAppStoreVersion, this.localVersionNumber()))
      return UPDATE_TYPES.REVISION

    return -1
  }

  private _getAlertTypeForVersion(currentAppStoreVersion): number {
    let alertType = ALERT_TYPES.OPTION

    const updateType = this._getUpdateTypeForVersion(currentAppStoreVersion)
    switch(alertType) {
      case UPDATE_TYPES.MAJOR: {
        if (this._majorUpdateAlertType) alertType = this._majorUpdateAlertType
        break;
      }
      case UPDATE_TYPES.MINOR: {
        if (this._minorUpdateAlertType) alertType = this._minorUpdateAlertType
        break;
      }
      case UPDATE_TYPES.PATCH: {
        if (this._patchUpdateAlertType) alertType = this._patchUpdateAlertType
        break;
      }
      case UPDATE_TYPES.REVISION: {
        if (this._revisionUpdateAlertType) alertType = this._revisionUpdateAlertType
        break;
      }
      default: break;
    }

    return alertType
  }

  private _showAlertForAppStoreVersion(result: AppleStoreResult) {
    // Show Appropriate Alert Dialog
    const alertType = this._getAlertTypeForVersion(result.version)
    switch(alertType) {
      case ALERT_TYPES.FORCE: {
        const options = {
          title: "FORCE Update available",
          message: `Version ${result.version} is available in App Store.`,
          okButtonText: "Update",
        };
        dialogs.confirm(options).then((confirmed: boolean) => {
          if(confirmed) this._launchAppStore(result.trackId)
        });
        break;
      }
      case ALERT_TYPES.OPTION: {
        const options = {
          title: "OPTION Update available",
          message: `Version ${result.version} is available in App Store.`,
          okButtonText: "Update",
          neutralButtonText: "Skip"
        };
        dialogs.confirm(options).then((confirmed: boolean) => {
          if(confirmed) this._launchAppStore(result.trackId)
        });
        break;
      }
      case ALERT_TYPES.NONE: {
        break;
      }
      default: break;
    }
  }

  private _launchAppStore(appID: number) {
    const appStoreUrl = `${this.ITUNES_BASE_URL}/app?id=${appID}`

    // Web Path
    utils.openUrl(appStoreUrl)

    // App Path
    // utils.openUrl((NSURL.URLWithString(`itms-apps://itunes.com/app/${this.BUNDLE_ID}`))
  }

  private _getItunesLookupUrl(): string {
    let url = `${this.ITUNES_BASE_URL}/lookup?bundleId=${this.BUNDLE_ID}`
    if (this.countryCode) {
      url = `${url}&country=${this.countryCode}`
    }
    return url
  }
}
