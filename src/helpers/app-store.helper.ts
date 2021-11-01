import { AppStoreConstants } from '../constants'
import { IAppleStoreInfos, IAppleStoreResult } from '../interfaces'
import { ResponseHelper } from './'

export class AppStoreHelper {
  static getAppInfos(bundleID: string, countryCode?: string): Promise<IAppleStoreResult | null> {
    return AppStoreHelper._getLookupFile(bundleID, countryCode)
      .then(ResponseHelper.handleErrorStatus)
      .then(response => response.json())
      .then(AppStoreHelper._parseResource)
  }

  private static _getLookupFile(bundleID: string, countryCode?: string) {
    return fetch(AppStoreHelper._getItunesLookupUrl(bundleID, countryCode))
  }

  private static _parseResource(resource: IAppleStoreInfos): IAppleStoreResult | null {
    if (resource.resultCount === 0) return null
    return resource.results[0]
  }

  private static _getItunesLookupUrl(bundleId: string, countryCode?: string): string {
    let url = `${AppStoreConstants.ITUNES_BASE_URL}/lookup?bundleId=${bundleId}`
    if (countryCode) {
      url += `&hl=${countryCode}`
    }
    return url
  }
}
