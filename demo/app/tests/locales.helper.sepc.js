const StoreUpdate = require('nativescript-store-update')
const LocalesHelper = StoreUpdate.LocalesHelper
const testConstants = require('./tests.constants.spec')

describe('LocalesHelper ', () => {
  describe('translate function', () => {
    it('returns a translation if it exists', () => {
      expect(LocalesHelper.translate(testConstants.translation.key)).toEqual(
        testConstants.translation.value
      )
    })

    it('returns a translation if it exists', () => {
      expect(LocalesHelper.translate('NOPE')).toEqual('')
    })
  })

  describe('changeLang function', () => {
    it(`changes active lang if it's available`, () => {
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('fr')
      expect(LocalesHelper.currentLang).toEqual('fr')
    })

    it(`changes use non regionalized version if it necessary`, () => {
      LocalesHelper.changeLang('en')
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('fr-NOPE')
      expect(LocalesHelper.currentLang).toEqual('fr')
    })

    it(`does not change active lang if translation is not available`, () => {
      LocalesHelper.changeLang('en')
      expect(LocalesHelper.currentLang).toEqual('en')
      LocalesHelper.changeLang('nope')
      expect(LocalesHelper.currentLang).toEqual('en')
    })
  })
})
