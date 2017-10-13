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

export class StoreUpdate {
  private static _storeUpdateCommon
  private static _instantiated = false

  /*
  *  Public
  */

  static init(config: IStoreUpdateConfig) {
    if (StoreUpdate._instantiated) throw new Error('NS Store Update already configured')
    StoreUpdate._storeUpdateCommon = new StoreUpdateCommon({
      ...config,
      onConfirmed: StoreUpdate._openStore.bind(StoreUpdate),
    })
    StoreUpdate._instantiated = true
  }

  static checkForUpdate() {
    if (!StoreUpdate._instantiated) return
    GooglePlayHelper.getAppInfos(StoreUpdate._storeUpdateCommon.getBundleId())
      .then(StoreUpdate._extendResults)
      .then(
        StoreUpdate._storeUpdateCommon.triggerAlertIfEligible.bind(StoreUpdate._storeUpdateCommon)
      )
      .catch(console.error)
  }

  /*
   *  Protected
   */

  protected static _openStore() {
    const storeUrl = `market://details?id=${StoreUpdate._storeUpdateCommon.getBundleId()}`
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
