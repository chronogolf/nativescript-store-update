const StoreUpdate = require('nativescript-store-update')
const GooglePlayHelper = StoreUpdate.GooglePlayHelper

const appId = 'com.nssu.test'
const countryCode = 'ca'
const urlWithCountryCode = `https://play.google.com/store/apps/details?id=${appId}&hl=${countryCode}`
const urlWithoutCountryCode = `https://play.google.com/store/apps/details?id=${appId}`
const storePage = `
<div>
  <div><div itemprop="datePublished">12 Sept 2017</div></div>
  <div><div itemprop="operatingSystems">4.2 and beyond</div></div>
  <div><div itemprop="softwareVersion">1.2.3</div></div>
</div>
`
const storeParsedPage = {
  date: '12 Sept 2017',
  os: '4.2',
  version: '1.2.3',
}

describe('GooglePlayHelper ', function() {
  describe('_getStoreAppUrl function', function() {
    it('should return proper Url', function() {
      expect(GooglePlayHelper._getStoreAppUrl(appId, countryCode)).toEqual(urlWithCountryCode)
    })

    it('should return url without country code if not provided', function() {
      expect(GooglePlayHelper._getStoreAppUrl(appId)).toEqual(urlWithoutCountryCode)
    })
  })

  describe('_parseResource function', function() {
    it('should return parsed resource', function() {
      expect(GooglePlayHelper._parseResource(storePage)).toEqual(storeParsedPage)
    })
  })

  describe('_getAppPage function', function() {
    it('return fetch with Google play lookup url', function() {
      const returnValue = 'Success'
      spyOn(global, 'fetch').and.returnValue(returnValue)
      expect(GooglePlayHelper._getAppPage(appId, countryCode)).toEqual(returnValue)
      expect(global.fetch).toHaveBeenCalledWith(urlWithCountryCode)
    })
  })

  describe('getAppInfos function', function() {
    it('TOFIX - Should return first result', function() {
      const response = {
        status: 200,
        text: () => storePage
      }
      spyOn(global, 'fetch').and.returnValue(Promise.resolve(response))
      console.dir(response)
      GooglePlayHelper.getAppInfos(appId, countryCode)
        .then(result => {
          console.dir(result)
          expect(result).toEqual(storeParsedPage)
        })
    })
  })
})
