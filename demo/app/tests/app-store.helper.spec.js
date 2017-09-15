const StoreUpdate = require('nativescript-store-update')
const AppStoreHelper = StoreUpdate.AppStoreHelper

describe('AppStoreHelper ', function() {
  describe('_getItunesLookupUrl function', function() {
    it('should return proper Url', function() {
      const appId = 'com.nssu.test'
      const countryCode = 'ca'
      const expectedUrl = `https://itunes.apple.com/lookup?bundleId=${appId}&hl=${countryCode}`
      expect(AppStoreHelper._getItunesLookupUrl(appId, countryCode)).toEqual(expectedUrl)
    })

    it('should return url with country code if provided', function() {
      const appId = 'com.nssu.test'
      const expectedUrl = `https://itunes.apple.com/lookup?bundleId=${appId}`
      expect(AppStoreHelper._getItunesLookupUrl(appId)).toEqual(expectedUrl)
    })
  })

  describe('_parseResource function', function() {
    it('should return first available resource', function() {
      const resource = {
        resultCount: 3,
        results: [1, 2, 3]
      }
      expect(AppStoreHelper._parseResource(resource)).toEqual(resource.results[0])
    })

    it('should return null if result count = 0', function() {
      const resource = {
        resultCount: 0
      }
      expect(AppStoreHelper._parseResource(resource)).toBe(null)
    })
  })

  describe('_getLookupFile function', function() {
    it('call fetch with itunesStore lookup url', function() {
      const appId = 'com.nssu.test'
      const countryCode = 'ca'
      const expectedUrl = `https://itunes.apple.com/lookup?bundleId=${appId}&hl=${countryCode}`
      const returnValue = 'Success'
      spyOn(global, 'fetch').and.returnValue(returnValue)
      expect(AppStoreHelper._getLookupFile(appId, countryCode)).toEqual(returnValue)
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('getAppInfos function', function() {
    it('Should return first result', function() {
      const appId = 'com.nssu.test'
      const countryCode = 'ca'
      const expectedUrl = `https://itunes.apple.com/lookup?bundleId=${appId}&hl=${countryCode}`
      const resource = {
        resultCount: 3,
        results: [1, 2, 3]
      }
      const response = {
        status: 200,
        json: () => resource
      }
      const returnValue = resource.results[0]
      spyOn(global, 'fetch').and.returnValue(Promise.resolve(response))
      AppStoreHelper.getAppInfos(appId, countryCode)
      .then((result) => {
        expect(result).toEqual(returnValue)
      })
    })
  })
})
