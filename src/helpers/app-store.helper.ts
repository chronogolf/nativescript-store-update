import { AppStoreConstants } from "../constants";
import { AppleStoreInfos, AppleStoreResult } from "../interfaces";
import { ResponseHelper } from "./";

export class AppStoreHelper {
  public static getAppInfos(bundleID, countryCode?) {
    return AppStoreHelper._getLookupFile(bundleID, countryCode)
      .then(ResponseHelper.handleErrorStatus)
      .then(response => response.json())
      .then(AppStoreHelper._parseResource);
  }

  private static _getLookupFile(bundleID, countryCode?) {
    return fetch(AppStoreHelper._getItunesLookupUrl(bundleID, countryCode));
  }

  private static _parseResource(resource: AppleStoreInfos): AppleStoreResult {
    if (resource.resultCount === 0) return null;
    return resource.results[0];
  }

  private static _getItunesLookupUrl(bundleId, countryCode?): string {
    let url = `${AppStoreConstants.ITUNES_BASE_URL}/lookup?bundleId=${bundleId}`;
    if (countryCode) {
      url += `&hl=${countryCode}`;
    }
    return url;
  }
}
