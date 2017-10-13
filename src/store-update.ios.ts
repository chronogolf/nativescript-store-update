import * as app from 'tns-core-modules/application'
import * as http from 'tns-core-modules/http'
import * as utils from 'tns-core-modules/utils/utils'
import { AppStoreHelper } from './helpers'
import { IAppleStoreResult, IStoreUpdateConfig } from './interfaces'
import { StoreUpdateCommon } from './store-update.common'
import { ForegroundDelegage } from './store-update.delegate'

export * from './constants'
export * from './helpers'
export * from './interfaces'

app.ios.delegate = ForegroundDelegage

export class StoreUpdate extends StoreUpdateCommon {
  private static _storeUpdateCommon
  private static _instantiated = false
  private static _trackViewUrl

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
    AppStoreHelper.getAppInfos(
      StoreUpdate._storeUpdateCommon.getBundleId(),
      StoreUpdate._storeUpdateCommon.countryCode
    )
      .then(StoreUpdate._extendResults)
      .then(
        StoreUpdate._storeUpdateCommon.triggerAlertIfEligible.bind(StoreUpdate._storeUpdateCommon)
      )
      .catch(e => console.error(e))
  }

  /*
   *  Protected
   */

  protected static _openStore() {
    // App Path
    utils.openUrl(
      NSURL.URLWithString(`itms-apps://itunes.com/app/${StoreUpdate.getBundleId()}`).absoluteString
    )
  }

  /*
   *  Private
   */

  private static _extendResults(result: IAppleStoreResult) {
    return {
      ...result,
      systemVersion: UIDevice.currentDevice.systemVersion,
    }
  }
}
