const StoreUpdate = require('nativescript-store-update')
const AppStoreHelper = StoreUpdate.AppStoreHelper
const testConstants = require('./tests.constants.spec')

describe('AppStoreHelper ', () => {
  describe('_getItunesLookupUrl function', () => {
    it('should return proper Url', () => {
      expect(AppStoreHelper._getItunesLookupUrl(
        testConstants.environment.appId,
        testConstants.environment.countryCode
      )).toEqual(testConstants.ios.urlWithCountryCode)
    })

    it('should return url without country code if not provided', () => {
      expect(AppStoreHelper._getItunesLookupUrl(testConstants.environment.appId))
        .toEqual(testConstants.ios.urlWithoutCountryCode)
    })
  })

  describe('_parseResource function', () => {
    it('should return first available resource', () => {
      expect(AppStoreHelper._parseResource(testConstants.ios.validResource))
        .toEqual(testConstants.ios.validResource.results[0])
    })

    it('should return null if result count = 0', () => {
      expect(AppStoreHelper._parseResource(testConstants.ios.nonValidResource)).toBe(null)
    })
  })

  describe('_getLookupFile function', () => {
    it('return fetch with itunesStore lookup url', () => {
      const returnValue = 'Success'
      spyOn(global, 'fetch').and.returnValue(returnValue)
      expect(AppStoreHelper._getLookupFile(
        testConstants.environment.appId,
        testConstants.environment.countryCode
      )).toEqual(returnValue)
      expect(global.fetch).toHaveBeenCalledWith(testConstants.ios.urlWithCountryCode)
    })
  })

  describe('getAppInfos function', () => {
    it('Should return first result', () => {
      const response = {
        status: 200,
        json: () => testConstants.ios.validResource
      }
      const returnValue = testConstants.ios.validResource.results[0]
      spyOn(global, 'fetch').and.returnValue(Promise.resolve(response))
      AppStoreHelper.getAppInfos(
        testConstants.environment.appId,
        testConstants.environment.countryCode
      ).then(result => {
        expect(result).toEqual(returnValue)
      })
    })
  })
})
