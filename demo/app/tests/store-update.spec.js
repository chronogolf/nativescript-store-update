const moment = require('moment')
const StoreUpdateModule = require('nativescript-store-update')
const appSettings = require('tns-core-modules/application-settings')
const dialogs = require('tns-core-modules/ui/dialogs')
const StoreUpdate = StoreUpdateModule.StoreUpdate
const LocalesHelper = StoreUpdateModule.LocalesHelper
const UpdateTypesConstants = StoreUpdateModule.UpdateTypesConstants
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants

const config = {
  majorUpdateAlertType: AlertTypesConstants.FORCE,
  minorUpdateAlertType: AlertTypesConstants.OPTION,
  patchUpdateAlertType: AlertTypesConstants.NONE,
  revisionUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 2,
  countryCode: 'ca',
}

describe('StoreUpdate ', () => {

  describe('init function', () => {
    beforeAll(() => {
      StoreUpdate.init(config)
    })

    it('should set instatiated to true', () => {
      expect(StoreUpdate.instatiated).toBe(true)
    })

    it('should set _majorUpdateAlertType to config', () => {
      expect(StoreUpdate._majorUpdateAlertType).toEqual(config.majorUpdateAlertType)
    })

    it('should set _minorUpdateAlertType to config', () => {
      expect(StoreUpdate._minorUpdateAlertType).toEqual(config.minorUpdateAlertType)
    })

    it('should set _patchUpdateAlertType to config', () => {
      expect(StoreUpdate._patchUpdateAlertType).toEqual(config.patchUpdateAlertType)
    })

    it('should set _revisionUpdateAlertType to config', () => {
      expect(StoreUpdate._revisionUpdateAlertType).toEqual(config.revisionUpdateAlertType)
    })

    it('should set _notifyNbDaysAfterRelease to config', () => {
      expect(StoreUpdate._notifyNbDaysAfterRelease).toEqual(config.notifyNbDaysAfterRelease)
    })

    it('should set _countryCode to config', () => {
      expect(StoreUpdate._countryCode).toEqual(config.countryCode)
    })

    it('should not be possible to init twice', () => {
      const newConf = Object.assign({}, config, {
        countryCode: 'fr'
      })
      StoreUpdate.init(newConf)
      expect(StoreUpdate._countryCode).toEqual(config.countryCode)
    })

  })

  describe('_getAlertTypeForVersion function', () => {
    it('should return config majorUpdateAlertType for major update', () => {
      expect(StoreUpdate._getAlertTypeForVersion('2.1.1.1')).toEqual(config.majorUpdateAlertType)
    })
    it('should return config minorUpdateAlertType for minor update', () => {
      expect(StoreUpdate._getAlertTypeForVersion('1.2.1.1')).toEqual(config.minorUpdateAlertType)
    })
    it('should return config patchUpdateAlertType for major update', () => {
      expect(StoreUpdate._getAlertTypeForVersion('1.1.2.1')).toEqual(config.patchUpdateAlertType)
    })
    it('should return config revisionUpdateAlertType for major update', () => {
      expect(StoreUpdate._getAlertTypeForVersion('1.1.1.2')).toEqual(config.revisionUpdateAlertType)
    })
  })

  describe('_buildDialogOptions function', () => {
    const defaultOptions = options = {
      message: LocalesHelper.translate('ALERT_MESSAGE'),
      neutralButtonText: null,
      okButtonText: LocalesHelper.translate('ALERT_UPDATE_BUTTON'),
      title: LocalesHelper.translate('ALERT_TITLE'),
    }
    const skippableOptions = Object.assign({}, defaultOptions, {
      neutralButtonText: LocalesHelper.translate('ALERT_SKIP_BUTTON'),
    })
    it('should return options with neutralButtonText by default', () => {
      expect(StoreUpdate._buildDialogOptions()).toEqual(skippableOptions)
    })
    it('should return options with neutralButtonText if skippable is true', () => {
      expect(StoreUpdate._buildDialogOptions({ skippable: true })).toEqual(skippableOptions)
    })
    it('should return options without neutralButtonText if skippable is false', () => {
      expect(StoreUpdate._buildDialogOptions({ skippable: false })).toEqual(defaultOptions)
    })
  })

  describe('_showAlertForUpdate function', () => {
    beforeAll(() => {
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve())
    })
    it('should display config majorUpdateAlertType confirm for major update', () => {
      const skippable = config.majorUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = StoreUpdate._buildDialogOptions({ skippable })
      StoreUpdate._showAlertForUpdate('2.1.1.1')
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
    it('should display config minorUpdateAlertType confirm for minor update', () => {
      const skippable = config.minorUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = StoreUpdate._buildDialogOptions({ skippable })
      StoreUpdate._showAlertForUpdate('1.2.1.1')
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
    it('should not display confirm for config PatchUpdate version', () => {
      StoreUpdate._showAlertForUpdate('1.1.2.1')
      .catch(err => expect(err).toEqual(null))
    })
    it('should display config revisionUpdateAlertType confirm for minor update', () => {
      const skippable = config.revisionUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = StoreUpdate._buildDialogOptions({ skippable })
      StoreUpdate._showAlertForUpdate('1.1.1.2')
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
  })

  describe('_getUpdateTypeForVersion function', () => {
    it('should return MAJOR code if major update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion('2.1.1.1'))
        .toEqual(UpdateTypesConstants.MAJOR)
    })

    it('should return MINOR code if minor update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion('1.2.1.1'))
        .toEqual(UpdateTypesConstants.MINOR)
    })

    it('should return PATCH code if patch update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion('1.1.2.1'))
        .toEqual(UpdateTypesConstants.PATCH)
    })

    it('should return REVISION code if revision update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion('1.1.1.2'))
        .toEqual(UpdateTypesConstants.REVISION)
    })

    it('should return -1 code if no update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion('1.1.1.1')).toEqual(-1)
    })
  })

  describe('_isUpdateCompatibleWithDeviceOS function', () => {
    it('should return true if minimum required version is null', () => {
      expect(StoreUpdate._isUpdateCompatibleWithDeviceOS('4.1', null)).toBe(true)
    })

    it('should return true if os version is higher than minimum required version', () => {
      expect(StoreUpdate._isUpdateCompatibleWithDeviceOS('4.1', '4.0')).toBe(true)
    })

    it('should return true if os version is equal to minimum required version', () => {
      expect(StoreUpdate._isUpdateCompatibleWithDeviceOS('4.1', '4.1')).toBe(true)
    })

    it('should return false if os version is lower than minimum required version', () => {
      expect(StoreUpdate._isUpdateCompatibleWithDeviceOS('4.0', '4.1')).toBe(false)
    })
  })

  describe('_hasBeenReleasedLongerThanDelay function', () => {
    it('should return true if release delay is superior to config', () => {
      const threeDaysAgo = moment().subtract(3, 'days').toDate()
      expect(StoreUpdate._hasBeenReleasedLongerThanDelay(threeDaysAgo)).toBe(true)
    })

    it('should return false if release delay is inferior to config', () => {
      const today = moment().toDate()
      expect(StoreUpdate._hasBeenReleasedLongerThanDelay(today)).toBe(false)
    })

    it('should return false if no release date is given', () => {
      expect(StoreUpdate._hasBeenReleasedLongerThanDelay()).toBe(false)
    })
  })

  describe('_isAppStoreVersionNewer function', () => {
    it('should return true if store version is superior to local', () => {
      expect(StoreUpdate._isAppStoreVersionNewer('2.1.1.1')).toBe(true)
    })

    it('should return false if store version is equal to local', () => {
      expect(StoreUpdate._isAppStoreVersionNewer('1.1.1.1')).toBe(false)
    })

    it('should return false if store version is inferior to local', () => {
      expect(StoreUpdate._isAppStoreVersionNewer('1.1.0.1')).toBe(false)
    })
  })

  describe('_isCurrentVersionSkipped function', () => {
    beforeAll(() => {
      appSettings.remove('lastVersionSkipped')
    })

    it('should return false if store version is not defined', () => {
      expect(StoreUpdate._isCurrentVersionSkipped('2.1.1.1')).toBe(false)
    })

    it('should return true if store version is matching local', () => {
      appSettings.setString('lastVersionSkipped', '2.1.1.1')
      expect(StoreUpdate._isCurrentVersionSkipped('2.1.1.1')).toBe(true)
    })

    it('should return false if store version is not matching local', () => {
      expect(StoreUpdate._isCurrentVersionSkipped('2.2.1.1')).toBe(false)
    })

    afterAll(() => {
      appSettings.remove('lastVersionSkipped')
    })
  })
})
