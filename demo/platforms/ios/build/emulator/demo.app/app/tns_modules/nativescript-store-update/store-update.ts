import { Common } from './store-update.common';
import * as appSettings from 'tns-core-modules/application-settings';
import * as moment from 'moment/moment';

var http = require('http')

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

  private ITUNES_URL: string = 'https://itunes.apple.com/lookup'

  // lastVersionCheckPerformedOnDate: date
  appID: string
  currentInstalledVersion: string
  currentAppStoreVersion: string
  updateAvailableMessage: string
  theNewVersionMessage: string
  updateButtonText: string
  nextTimeButtonText: string
  skipButtonText: string

  _showAlertAfterCurrentVersionHasBeenReleasedForDays: number = 3

  constructor() {
    super();
    this.checkForUpdate();

    console.log("this.version =>", this.versionNumber())
  }

  public versionNumber() {
    return NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleShortVersionString");
  }

  public checkForUpdate() {
    const itunesLookupUrl = this._getItunesUrl()

    http.request({
      method: "GET",
      url: itunesLookupUrl,
      timeout: 2000
    })
    .then(result => {
      if (result.statusCode !== 200) {
        throw new Error("Unexpcted HTTP status code (" + result.statusCode + ")");
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

    // TODO ParseFloat only cast to first ., need to process it manually later
    return parseFloat(systemVersion) > parseFloat(requiredOSVersion)
  }

  private _parseResults(data) {
    if (this._isUpdateCompatibleWithDeviceOS(data)) {
      console.log("Compatible for Update")

      // static get lang() {
      //   const _settingLang = appSettings.getString(ApplicationSettingsConstant.LANG)
      //   return _settingLang || AppConfig.deviceLocale || 'en'
      // }
      // static set lang(value) { appSettings.setString(ApplicationSettingsConstant.LANG, value) }

      const lastVersionCheckPerformedOnDate = moment().format()
      appSettings.setString('lastVersionCheckPerformedOnDate', lastVersionCheckPerformedOnDate)

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

      console.log("days since release =>", daysSinceRelease)
      if (!(daysSinceRelease >= this._showAlertAfterCurrentVersionHasBeenReleasedForDays)) {
        console.log(`Your app has been released for ${daysSinceRelease} days, but we cannot prompt the user until ${this._showAlertAfterCurrentVersionHasBeenReleasedForDays} days have passed.`)
        return
      }

      /**
       Current version that has been uploaded to the AppStore.
       Used to contain all versions, but now only contains the latest version.
       Still returns an instance of NSArray.
       */

      const versionsInAppStore = results[0].version

      // if (versionsInAppStore === null) return
      // if ([versionsInAppStore count]) {
      //     _currentAppStoreVersion = [versionsInAppStore objectAtIndex:0];
      //     if ([self isAppStoreVersionNewer:_currentAppStoreVersion]) {
      //         [self appStoreVersionIsNewer:_currentAppStoreVersion];
      //     } else {
      //         [self printDebugMessage:@"Currently installed version is newer."];
      //     }
      // }
      // }



    } else {
      console.log("Device is incompatible with installed verison of iOS.")
    }
  }


  private _getItunesUrl(): string {
    //   if ([self countryCode]) {
    //       NSURLQueryItem *countryQueryItem = [NSURLQueryItem queryItemWithName:@"country" value:_countryCode];
    //       [items addObject:countryQueryItem];
    //   }

    const bundleId = `com.chronogolf.booking.chronogolf`
    return `${this.ITUNES_URL}?bundleId=${bundleId}`
  }
}
