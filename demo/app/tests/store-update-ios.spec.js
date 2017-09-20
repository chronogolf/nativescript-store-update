const moment = require('moment')
const StoreUpdateModule = require('nativescript-store-update')
const platform = require('tns-core-modules/platform')
const utils = require('tns-core-modules/utils/utils')
const StoreUpdate = StoreUpdateModule.StoreUpdate
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants

const config = {
  majorUpdateAlertType: AlertTypesConstants.FORCE,
  minorUpdateAlertType: AlertTypesConstants.OPTION,
  patchUpdateAlertType: AlertTypesConstants.NONE,
  revisionUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 2,
  countryCode: 'ca',
}

if (!platform.isIOS) return

describe('StoreUpdate IOS ', () => {
  beforeAll(() => {
    StoreUpdate.init(config)
  })

  describe('_openStore function', () => {
    it('should open store page', () => {
      const storeURL = NSURL.URLWithString(`itms-apps://itunes.com/app/com.bitstrips.imoji`).absoluteString
      spyOn(utils, 'openUrl')
      StoreUpdate._openStore()
      expect(utils.openUrl).toHaveBeenCalledWith(storeURL)
    })
  })

  describe('_extendResults function', () => {
    it('should return formated results', () => {
      const results = {
        bundleId: 'com.bitstrips.imoji',
        trackId: 12,
        version: '1.1.1.1',
        minimumOsVersion: '4.2',
        currentVersionReleaseDate: moment().toDate(),
      }
      const extendedResults = Object.assign({
        systemVersion: UIDevice.currentDevice.systemVersion,
      }, results)
      expect(StoreUpdate._extendResults(results)).toEqual(extendedResults)
    })
  })
})
