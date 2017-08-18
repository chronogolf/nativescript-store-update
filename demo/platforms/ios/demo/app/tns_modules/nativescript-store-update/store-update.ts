import * as appSettings from 'tns-core-modules/application-settings';
import * as moment from 'moment';
import * as dialogs from 'tns-core-modules/ui/dialogs';

import { Common } from './store-update.common';
import { LocalesConstant } from './constants/locales'

var http = require('http')
var utils = require('utils/utils')

declare const NSBundle: any
declare const UIDevice: any

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

  // lastVersionCheckPerformedOnDate: date
  appID: string
  currentInstalledVersion: string
  currentAppStoreVersion: string
  updateAvailableMessage: string
  theNewVersionMessage: string
  updateButtonText: string
  nextTimeButtonText: string
  skipButtonText: string

  countryCode: string // = LocalesConstant.French

  _showAlertAfterCurrentVersionHasBeenReleasedForDays: number = 3

  constructor() {
    super();
    this.checkForUpdate();
  }

  public versionNumber() {
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

  private _isUpdateCompatibleWithDeviceOS(appData: AppleStoreInfos): boolean {
    const results: AppleStoreResult[] = appData.results

    if (appData.resultCount === 0) return false
    const requiredOSVersion = results[0].minimumOsVersion

    if (requiredOSVersion === null) return true

    const systemVersion = UIDevice.currentDevice.systemVersion

    console.log(`System Version :> ${systemVersion}`, `Required Version :> ${requiredOSVersion}`)

    return this._isVersionHigher(systemVersion, requiredOSVersion) !== -1
  }

  private _parseResults(data) {
    if (this._isUpdateCompatibleWithDeviceOS(data)) {
      console.log("Compatible for Update")

      const lastVersionCheckPerformedOnDate = moment().format()
      // appSettings.setString('lastVersionCheckPerformedOnDate', lastVersionCheckPerformedOnDate)

      // Store version comparison date
      const results: AppleStoreResult[] = data.results

      /**
       Checks to see when the latest version of the app was released.
       If the release date is greater-than-or-equal-to `_showAlertAfterCurrentVersionHasBeenReleasedForDays`,
       the user will prompted to update their app (if the version is newer - checked later on in this method).
       */

      const releaseDateString = results[0].currentVersionReleaseDate
      if (releaseDateString === null) return

      const daysSinceRelease = moment(lastVersionCheckPerformedOnDate).diff(releaseDateString, 'days')

      console.log(`days since release => ${daysSinceRelease}`)

      if (!(daysSinceRelease >= this._showAlertAfterCurrentVersionHasBeenReleasedForDays)) {
        console.log(`Your app has been released for ${daysSinceRelease} days, but we cannot prompt the user until ${this._showAlertAfterCurrentVersionHasBeenReleasedForDays} days have passed.`)
        return
      }

      /**
       Current version that has been uploaded to the AppStore.
       Used to contain all versions, but now only contains the latest version.
       Still returns an instance of Array.
       */

      const versionsInAppStore = results[0].version

      console.log(`localVersion => ${this.versionNumber()}, versionsInAppStore => ${versionsInAppStore}`)

      if (versionsInAppStore === null) return

      if (this._isAppStoreVersionNewer(versionsInAppStore)) {
        var options = {
          title: "Update available",
          message: `Version ${versionsInAppStore} is available in App Store.`,
          okButtonText: "Update",
          neutralButtonText: "Skip"
        };
        dialogs.confirm(options).then((result: boolean) => {
          if(result) this._launchAppStore(results[0].trackId)
        });
      } else {
        console.log(`Current Version is up-to-date`)
      }

      //     _currentAppStoreVersion = [versionsInAppStore objectAtIndex:0];
      //     if ([self isAppStoreVersionNewer:_currentAppStoreVersion]) {
      //         [self appStoreVersionIsNewer:_currentAppStoreVersion];
      // }

    } else {
      console.log(`Device is incompatible with installed version of iOS.`)
    }
  }

  private _isAppStoreVersionNewer(currentAppStoreVersion: string): boolean {
    // return this._isVersionHigher(currentAppStoreVersion, this.versionNumber())
    return true // Debug Purpose
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
    console.log(url)
    return url
  }

  private _isVersionHigher(left: string, right: string) {
    const a = left.split('.')
    const b = right.split('.')
    let i = 0
    const len = Math.max(a.length, b.length);

    for (; i < len; i++) {
      if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
          return 1;
      } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
          return -1;
      }
    }

    return 0;
  }

}
