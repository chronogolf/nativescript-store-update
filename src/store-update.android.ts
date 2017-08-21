import { StoreUpdateCommon } from "./store-update.common";
import { getVersionCode, getVersionName } from 'nativescript-appversion'

const PLAY_STORE_ROOT_WEB: string = "https://play.google.com/store/apps/details?hl=en&id=";
const PLAY_STORE_HTML_TAGS_TO_GET_RIGHT_POSITION: string = 'itemprop="softwareVersion"> ';
const PLAY_STORE_HTML_TAGS_TO_REMOVE_USELESS_CONTENT: string = "  </div> </div>";
const PLAY_STORE_PACKAGE_NOT_PUBLISHED_IDENTIFIER: string =
  "We're sorry, the requested URL was not found on this server.";

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
    fetch(`${PLAY_STORE_ROOT_WEB}com.shots.android`)
      .then(r => r.text())
      .then(p => {
        const versionRegex = /itemprop="softwareVersion">\s*([0-9.]*)\s*<\/div>\s*<\/div>/gm
        const dateRegex = /itemprop="datePublished">\s*([\w\s,]*)\s*<\/div>\s*<\/div>/gm
        const version = versionRegex.exec(p)[1]
        const date = dateRegex.exec(p)[1]
        console.dir(version)
        console.dir(date)
      })
      .catch(error => {
        console.error(error)
      })
  }


  private _initAppInfos() {
    getVersionName().then(v => this.appInfo.version = v)
    getVersionCode().then(v => this.appInfo.build = v)
  }
}
