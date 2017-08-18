import { Common } from './store-update.common';
// import * as application from "application";


export class StoreUpdate extends Common {

  private static PLAY_STORE_ROOT_WEB: string = "https://play.google.com/store/apps/details?id=";
  private static PLAY_STORE_HTML_TAGS_TO_GET_RIGHT_POSITION: string = "itemprop=\"softwareVersion\"> ";
  private static PLAY_STORE_HTML_TAGS_TO_REMOVE_USELESS_CONTENT: string = "  </div> </div>";
  private static PLAY_STORE_PACKAGE_NOT_PUBLISHED_IDENTIFIER: string = "We're sorry, the requested URL was not found on this server.";

  // public versionNumber() {
  //   var PackageManager = android.content.pm.PackageManager;
  //   var pkg = application.android.context.getPackageManager().getPackageInfo(application.android.context.getPackageName(),
  //     PackageManager.GET_META_DATA);
  //   return pkg.versionName;
  //   }

  // public static isVersionDownloadableNewer(mActivity: Activity, versionDownloadable: string): boolean {
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
}
