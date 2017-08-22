import { StoreUpdateCommon } from './store-update.common'
import { GooglePlayHelper } from './helpers/google-play.helper'
import { getVersionCode, getVersionName } from 'nativescript-appversion'
import { alert } from 'tns-core-modules/ui/dialogs'

export class StoreUpdate extends StoreUpdateCommon {
  appInfo: { version: string, build: string} = {
    version: '',
    build  : ''
  }
  // public versionNumber() {
  //   var PackageManager = android.content.pm.PackageManager;
  //   var pkg = application.android.context.getPackageManager().getPackageInfo(application.android.context.getPackageName(),
  //     PackageManager.GET_META_DATA);
  //   return pkg.versionName;
  //   }
  constructor() {
    super();
    this._initAppInfos()
    this.checkForUpdate();
  }

  get localVersionNumber(): string {
    return `${this.appInfo.version}.${this.appInfo.build}`;
  }

  // isVersionDownloadableNewer(mActivity: Activity, versionDownloadable: string): boolean {
  //     let versionInstalled: string = null;
  //     try {
  //       versionInstalled = mActivity.getPackageManager().getPackageInfo(mActivity.getPackageName(), 0).versionName;
  //     } catch (PackageManager.NameNotFoundException ignored) { }
  //     if (versionInstalled.equals(versionDownloadable)) { // If it is equal, no new version downloadable
  //         return false;
  //     } else {
  //         return versionCompareNumerically(versionDownloadable, versionInstalled) > 0; // Return if the versionDownloadble is newer than the installed
  //     }
  // }

  checkForUpdate() {
    GooglePlayHelper.getAppInfos()
      .then(infos => {
        this._checkAppVersion(infos.version)
        this._checkAppDate(infos.date)
      })
      .catch(console.error)
  }

  private _initAppInfos() {
    getVersionName().then(v => this.appInfo.version = v)
    getVersionCode().then(v => this.appInfo.build = v)
  }

  private _checkAppDate(storeDate) {
    alert(`
      local: ${new Date().toISOString()}
      vs
      distant: ${storeDate}
    `)
  }

  private _checkAppVersion(storeVersion) {
    alert(`
      local: ${this.appInfo.version}
      vs
      distant: ${storeVersion}
    `)
  }
}
