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

if (!platform.isAndroid) return

describe('StoreUpdate ANDROID ', () => {
  beforeAll(() => {
    StoreUpdate.init(config)
  })

  describe('_openStore function', () => {
    it('should open store page', () => {
      const storeURL = 'market://details?id=com.bitstrips.imoji'
      spyOn(utils, 'openUrl')
      StoreUpdate._openStore()
      expect(utils.openUrl).toHaveBeenCalledWith(storeURL)
    })
  })

  describe('_extendResults function', () => {
    it('should return formated results', () => {
      const results = {
        version: '1.1.1.1',
        os: '4.2',
        date: moment().toDate(),
      }
      const extendedResults = {
        currentVersionReleaseDate: results.date,
        minimumOsVersion: results.os,
        systemVersion: android.os.Build.VERSION.RELEASE,
        version: results.version,
      }
      expect(StoreUpdate._extendResults(results)).toEqual(extendedResults)
    })
  })
})
