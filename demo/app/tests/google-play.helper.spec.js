const StoreUpdate = require('nativescript-store-update')
const GooglePlayHelper = StoreUpdate.GooglePlayHelper
const testConstants = require('./tests.constants.spec')

describe('GooglePlayHelper ', () => {
  describe('_getStoreAppUrl function', () => {
    it('should return proper Url', () => {
      expect(GooglePlayHelper._getStoreAppUrl(
        testConstants.environment.appId,
        testConstants.environment.countryCode
      )).toEqual(testConstants.android.urlWithCountryCode)
    })

    it('should return url without country code if not provided', () => {
      expect(GooglePlayHelper._getStoreAppUrl(testConstants.environment.appId))
        .toEqual(testConstants.android.urlWithoutCountryCode)
    })
  })

  describe('_parseResource function', () => {
    it('should return parsed resource', () => {
      expect(GooglePlayHelper._parseResource(testConstants.android.storePage))
        .toEqual(testConstants.android.storeParsedPage)
    })
  })

  describe('_getAppPage function', () => {
    it('return fetch with Google play lookup url', () => {
      const returnValue = 'Success'
      spyOn(global, 'fetch').and.returnValue(returnValue)
      expect(GooglePlayHelper._getAppPage(
        testConstants.environment.appId,
        testConstants.environment.countryCode)
      ).toEqual(returnValue)
      expect(global.fetch).toHaveBeenCalledWith(testConstants.android.urlWithCountryCode)
    })
  })

  describe('getAppInfos function', () => {
    it('TOFIX - Should return first result', () => {
      const response = {
        status: 200,
        text: () => testConstants.android.storePage
      }
      spyOn(global, 'fetch').and.returnValue(Promise.resolve(response))
      GooglePlayHelper.getAppInfos(
        testConstants.environment.appId,
        testConstants.environment.countryCode
      ).then(result => {
        expect(result).toEqual(testConstants.android.storeParsedPage)
      })
    })
  })
})
