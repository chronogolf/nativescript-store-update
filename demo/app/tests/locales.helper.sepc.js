const StoreUpdate = require('nativescript-store-update')
const LocalesHelper = StoreUpdate.LocalesHelper

const translationKey = 'ALERT_TITLE'
const translationValue = 'Update available'

describe('LocalesHelper ', function() {
  describe('translate function', function() {
    it('should return a translation if it exists', function() {
      expect(LocalesHelper.translate(translationKey)).toEqual(translationValue)
    })

    it('should return a translation if it exists', function() {
      expect(LocalesHelper.translate('NOPE')).toEqual('')
    })
  })

  describe('changeLang function', function() {
    it(`should change active lang if it's available`, function() {
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('fr')
      expect(LocalesHelper.currentLang).toEqual('fr')
    })

    it(`should change use non regionalized version if it necessary`, function() {
      LocalesHelper.changeLang('en')
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('fr-NOPE')
      expect(LocalesHelper.currentLang).toEqual('fr')
    })

    it(`should not change active lang if translation is not available`, function() {
      LocalesHelper.changeLang('en')
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('nope')
      expect(LocalesHelper.currentLang).toEqual('en')
    })
  })
})
