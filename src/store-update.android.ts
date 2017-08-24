import { StoreUpdateCommon } from "./store-update.common";
import { GooglePlayHelper } from "./helpers/google-play.helper";
import { VersionHelper } from "./helpers/version.helper";
import { alert } from "tns-core-modules/ui/dialogs";

export * from "./constants";

export interface GoogleStoreResult {
  version: string;
  minimumOsVersion: string;
  currentVersionReleaseDate: string;
}

export class StoreUpdate extends StoreUpdateCommon {
  constructor() {
    super();
  }

  init(initParams: any) {
    super.init(initParams);
  }

  checkForUpdate() {
    GooglePlayHelper.getAppInfos(this.bundleId)
      .then((infos: GoogleStoreResult) => this._parseResults(infos))
      .catch(console.error);
  }

  /*
   *  Private
   */

  private _parseResults(result: GoogleStoreResult) {
    // if (this._isUpdateCompatibleWithDeviceOS(result)) {
    //   /**
    //    Checks to see when the latest version of the app was released.
    //    If the release date is greater-than-or-equal-to `notifyNbDaysAfterRelease`,
    //    user will prompted to update their app.
    //    */
    //   if (this._hasBeenReleasedLongerThanDelay(result.currentVersionReleaseDate)) return;
    //   /**
    //    Current version that has been uploaded to the AppStore.
    //    */
    //   if (this._isAppStoreVersionNewer(result.version)) {
    //     this._showAlertIfCurrentAppStoreVersionNotSkipped(result);
    //   }
    // } else {
    //   console.log(`Device is incompatible with installed version of iOS.`);
    // }
  }

  // private _checkAppVersion(versions) {
  //   if (VersionHelper.isMajorUpdate(versions.store, versions.local)) {
  //     return this._showMajorUpdateAlert(versions);
  //   }

  //   if (VersionHelper.isMinorUpdate(versions.store, versions.local)) {
  //     return this._showMinorUpdateAlert(versions);
  //   }

  //   if (VersionHelper.isPatchUpdate(versions.store, versions.local)) {
  //     return this._showPatchUpdateAlert(versions);
  //   }
  // }
}
