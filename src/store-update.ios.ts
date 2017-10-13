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
  private static _common
  private static _trackViewUrl

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
    AppStoreHelper.getAppInfos(StoreUpdate._common.getBundleId(), StoreUpdate._common.countryCode)
      .then(StoreUpdate._extendResults)
      .then(StoreUpdate._common.triggerAlertIfEligible.bind(StoreUpdate._common))
      .catch(e => console.error(e))
  }

  /*
   *  Protected
   */

  protected static _openStore() {
    // App Path
    utils.openUrl(
      NSURL.URLWithString(`itms-apps${StoreUpdate._trackViewUrl.slice(5)}`).absoluteString
    )
  }

  /*
   *  Private
   */

  private static _extendResults(result: IAppleStoreResult) {
    StoreUpdate._trackViewUrl = result.trackViewUrl
    return {
      ...result,
      systemVersion: UIDevice.currentDevice.systemVersion,
    }
  }
}
