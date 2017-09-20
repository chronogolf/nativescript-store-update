const moment = require('moment')
const StoreUpdateModule = require('nativescript-store-update')
const platform = require('tns-core-modules/platform')
const utils = require('tns-core-modules/utils/utils')
const StoreUpdate = StoreUpdateModule.StoreUpdate
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const testConstants = require('./tests.constants.spec')

if (!platform.isAndroid) return

describe('StoreUpdate ANDROID ', () => {
  beforeAll(() => {
    StoreUpdate.init(testConstants.config)
  })

  describe('_openStore function', () => {
    it('should open store page', () => {
      spyOn(utils, 'openUrl')
      StoreUpdate._openStore()
      expect(utils.openUrl).toHaveBeenCalledWith(testConstants.android.storeURL)
    })
  })

  describe('_extendResults function', () => {
    it('should return formated results', () => {
      const results = {
        version: testConstants.environment.appVersion,
        os: testConstants.environment.osVersion,
        date: testConstants.dates.today,
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
