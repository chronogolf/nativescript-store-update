import * as app from 'tns-core-modules/application'
import * as http from 'tns-core-modules/http'
import * as utils from 'tns-core-modules/utils/utils'
import { AppStoreHelper } from './helpers'
import { IAppleStoreResult, IStoreUpdateConfig } from './interfaces'
import { StoreUpdateCommon } from './store-update.common'
import { ForegroundDelegage } from './store-update.delegate'

export * from './constants'

app.ios.delegate = ForegroundDelegage

export class StoreUpdate extends StoreUpdateCommon {
  /*
   *  Public
   */

  public static checkForUpdate() {
    AppStoreHelper.getAppInfos(StoreUpdate.getBundleId(), StoreUpdate._countryCode)
      .then(StoreUpdate._extendResults)
      .then(StoreUpdate._triggerAlertIfEligible)
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

  private static _triggerAlertIfEligible(result) {
    if (!StoreUpdate._isEligibleForUpdate(result)) return
    StoreUpdate._triggerAlertForUpdate(result.version)
  }
}
