const StoreUpdate = require('nativescript-store-update')
const LocalesHelper = StoreUpdate.LocalesHelper
const testConstants = require('./tests.constants.spec')

describe('LocalesHelper ', () => {
  describe('translate function', () => {
    it('should return a translation if it exists', () => {
      expect(LocalesHelper.translate(testConstants.translation.key))
        .toEqual(testConstants.translation.value)
    })

    it('should return a translation if it exists', () => {
      expect(LocalesHelper.translate('NOPE')).toEqual('')
    })
  })

  describe('changeLang function', () => {
    it(`should change active lang if it's available`, () => {
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('fr')
      expect(LocalesHelper.currentLang).toEqual('fr')
    })

    it(`should change use non regionalized version if it necessary`, () => {
      LocalesHelper.changeLang('en')
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('fr-NOPE')
      expect(LocalesHelper.currentLang).toEqual('fr')
    })

    it(`should not change active lang if translation is not available`, () => {
      LocalesHelper.changeLang('en')
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('nope')
      expect(LocalesHelper.currentLang).toEqual('en')
    })
  })
})
