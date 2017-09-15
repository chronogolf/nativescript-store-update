const StoreUpdate = require('nativescript-store-update')
const AppStoreHelper = StoreUpdate.AppStoreHelper

const appId = 'com.nssu.test'
const countryCode = 'ca'
const urlWithCountryCode = `https://itunes.apple.com/lookup?bundleId=${appId}&hl=${countryCode}`
const urlWithoutCountryCode = `https://itunes.apple.com/lookup?bundleId=${appId}`
const validResource = {
  resultCount: 3,
  results: [1, 2, 3]
}
const nonValidResource = {
  resultCount: 0
}

describe('AppStoreHelper ', function() {
  describe('_getItunesLookupUrl function', function() {
    it('should return proper Url', function() {
      expect(AppStoreHelper._getItunesLookupUrl(appId, countryCode)).toEqual(urlWithCountryCode)
    })

    it('should return url without country code if not provided', function() {
      expect(AppStoreHelper._getItunesLookupUrl(appId)).toEqual(urlWithoutCountryCode)
    })
  })

  describe('_parseResource function', function() {
    it('should return first available resource', function() {
      expect(AppStoreHelper._parseResource(validResource)).toEqual(validResource.results[0])
    })

    it('should return null if result count = 0', function() {
      expect(AppStoreHelper._parseResource(nonValidResource)).toBe(null)
    })
  })

  describe('_getLookupFile function', function() {
    it('return fetch with itunesStore lookup url', function() {
      const returnValue = 'Success'
      spyOn(global, 'fetch').and.returnValue(returnValue)
      expect(AppStoreHelper._getLookupFile(appId, countryCode)).toEqual(returnValue)
      expect(global.fetch).toHaveBeenCalledWith(urlWithCountryCode)
    })
  })

  describe('getAppInfos function', function() {
    it('Should return first result', function() {
      const response = {
        status: 200,
        json: () => validResource
      }
      const returnValue = validResource.results[0]
      spyOn(global, 'fetch').and.returnValue(Promise.resolve(response))
      AppStoreHelper.getAppInfos(appId, countryCode)
      .then(result => {
        expect(result).toEqual(returnValue)
      })
    })
  })
})
