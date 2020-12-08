import { Application, Utils } from '@nativescript/core'

import { GooglePlayHelper } from './helpers'
import { IGoogleStoreResult, IStoreUpdateConfig } from './interfaces'
import { StoreUpdateCommon } from './store-update.common'

export * from './constants'
export * from './helpers'
export * from './interfaces'

Application.on(Application.resumeEvent, () => {
  StoreUpdate.checkForUpdate()
})

export class StoreUpdate {
  private static _common

  /*
  *  Public
  */

  static init(config: IStoreUpdateConfig) {
    if (StoreUpdate._common) throw new Error('NS Store Update already configured')
    StoreUpdate._common = new StoreUpdateCommon({
      ...config,
      onConfirmed: StoreUpdate._openStore.bind(StoreUpdate),
    })
  }

  static checkForUpdate() {
    if (!StoreUpdate._common) return
    GooglePlayHelper.getAppInfos(StoreUpdate._common.getBundleId())
      .then(StoreUpdate._extendResults)
      .then(StoreUpdate._common.triggerAlertIfEligible.bind(StoreUpdate._common))
      .catch(console.error)
  }

  /*
   *  Protected
   */

  protected static _openStore() {
    const storeUrl = `market://details?id=${StoreUpdate._common.getBundleId()}`
    Utils.openUrl(storeUrl)
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
