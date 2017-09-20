import * as app from 'tns-core-modules/application'
import * as utils from 'tns-core-modules/utils/utils'

import { GooglePlayHelper } from './helpers'
import { IGoogleStoreResult, IStoreUpdateConfig } from './interfaces'
import { StoreUpdateCommon } from './store-update.common'

export * from './constants'
export * from './helpers'
export * from './interfaces'

app.on(app.resumeEvent, () => {
  StoreUpdate.checkForUpdate()
})

export class StoreUpdate extends StoreUpdateCommon {
  private static _checkHasTimeouted = false
  private static _timeoutChecker
  private static _looperChecker

  /*
   *  Public
   */

  static checkForUpdate() {
    GooglePlayHelper.getAppInfos(StoreUpdate.getBundleId())
      .then(StoreUpdate._extendResults)
      .then(StoreUpdate._triggerAlertIfEligible.bind(StoreUpdate))
      .catch(console.error)
  }

  /*
   *  Protected
   */

  protected static _openStore() {
    const storeUrl = `market://details?id=${StoreUpdate.getBundleId()}`
    utils.openUrl(storeUrl)
  }

  /*
   *  Private
   */

  private static _extendResults(result: IGoogleStoreResult) {
    return {
      currentVersionReleaseDate: result.date,
      minimumOsVersion: result.os,
      systemVersion: android.os.Build.VERSION.RELEASE,
      version: result.version,
    }
  }
}
