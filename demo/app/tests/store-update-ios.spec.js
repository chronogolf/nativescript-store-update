const moment = require('moment')
const StoreUpdateModule = require('nativescript-store-update')
const platform = require('tns-core-modules/platform')
const utils = require('tns-core-modules/utils/utils')
const StoreUpdate = StoreUpdateModule.StoreUpdate
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const testConstants = require('./tests.constants.spec')

if (!platform.isIOS) return

describe('StoreUpdate IOS ', () => {
  beforeAll(() => {
    StoreUpdate.init(testConstants.config)
  })

  describe('_openStore function', () => {
    it('should open store page', () => {
      const storeURL = NSURL.URLWithString(testConstants.ios.storeURL).absoluteString
      spyOn(utils, 'openUrl')
      StoreUpdate._openStore()
      expect(utils.openUrl).toHaveBeenCalledWith(storeURL)
    })
  })

  describe('_extendResults function', () => {
    it('should return formated results', () => {
      const results = {
        bundleId: testConstants.environment.appId,
        trackId: 12,
        version: testConstants.environment.appVersion,
        minimumOsVersion: testConstants.environment.osVersion,
        currentVersionReleaseDate: testConstants.dates.today.toDate(),
      }
      const extendedResults = Object.assign({
        systemVersion: testConstants.environment.osVersion,
      }, results)
      expect(StoreUpdate._extendResults(results)).toEqual(extendedResults)
    })
  })
})
