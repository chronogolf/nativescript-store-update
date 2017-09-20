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

  describe('getBundleId function', () => {
    it('should return appId', () => {
      expect(StoreUpdate.getBundleId()).toEqual('com.bitstrips.imoji')
    })
  })

  describe('getLocalVersionNumber function', () => {
    it('should return app version', () => {
      expect(StoreUpdate.getLocalVersionNumber()).toEqual('1.1.1.1')
    })
  })

  describe('_isEligibleForUpdate function', () => {
    beforeAll(() => {
      spyOn(appSettings, 'setString')
    })
    it('should return true if new version released for long enough matching OS min versions', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: '2.2.2.2',
        currentVersionReleaseDate: moment().subtract(3, 'days').toDate(),
        minimumOsVersion: '1',
        systemVersion: '1',
      })).toBe(true)
    })
    it('should return false if store version is older than local', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: '0.2.2.2',
        currentVersionReleaseDate: moment().subtract(3, 'days').toDate(),
        minimumOsVersion: '1',
        systemVersion: '1',
      })).toBe(false)
    })
    it('should return false if store version is equal to local', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: '1.1.1.1',
        currentVersionReleaseDate: moment().subtract(3, 'days').toDate(),
        minimumOsVersion: '1',
        systemVersion: '1',
      })).toBe(false)
    })
    it('should return false if release date is too close', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: '2.2.2.2',
        currentVersionReleaseDate: moment().toDate(),
        minimumOsVersion: '1',
        systemVersion: '1',
      })).toBe(false)
    })
    it('should return false if os version is under min version required', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: '2.2.2.2',
        currentVersionReleaseDate: moment().subtract(3, 'days').toDate(),
        minimumOsVersion: '2',
        systemVersion: '1',
      })).toBe(false)
    })
    it('should return false if os version is under min version required', () => {
      StoreUpdate._setVersionAsSkipped('2.2.2.2')
      expect(StoreUpdate._isEligibleForUpdate({
        version: '2.2.2.2',
        currentVersionReleaseDate: moment().subtract(3, 'days').toDate(),
        minimumOsVersion: '2',
        systemVersion: '1',
      })).toBe(false)
    })
    afterAll(() => {
      appSettings.remove('lastVersionSkipped')
    })
  })

  describe('_setVersionAsSkipped function', () => {
    beforeAll(() => {
      spyOn(appSettings, 'setString')
    })
    it('should set skipped version in app settings', () => {
      const version = '1.2.1.1'
      StoreUpdate._setVersionAsSkipped(version)
      expect(appSettings.setString).toHaveBeenCalledWith('lastVersionSkipped', version)
    })
  })

  describe('_triggerAlertForUpdate function', () => {
    beforeAll(() => {
      spyOn(StoreUpdate, '_openStore')
      spyOn(StoreUpdate, '_setVersionAsSkipped')
    })
    it('should open store if confirmed', () => {
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve(true))
      StoreUpdate._triggerAlertForUpdate('1.2.1.1').then(() => {
        expect(StoreUpdate._openStore).toHaveBeenCalled()
      })
    })
    it('should skip version if not confirmed', () => {
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve(false))
      StoreUpdate._triggerAlertForUpdate('1.2.1.1').then(() => {
        expect(StoreUpdate._setVersionAsSkipped).toHaveBeenCalled()
      })
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

  describe('_triggerAlertIfEligible function', () => {
    const results = {
      bundleId: 'com.bitstrips.imoji',
      trackId: 12,
      version: '2.1.1.1',
      minimumOsVersion: '1.0',
      currentVersionReleaseDate: moment().subtract(3, 'days').toDate(),
      systemVersion: UIDevice.currentDevice.systemVersion,
    }

    it('should call _triggerAlertForUpdate if new valid version is available', () => {
      spyOn(StoreUpdate, '_triggerAlertForUpdate')
      StoreUpdate._triggerAlertIfEligible(results)
      expect(StoreUpdate._triggerAlertForUpdate).toHaveBeenCalled()
    })

    it('should not call _triggerAlertForUpdate if no new valid version is available', () => {
      const invalidResults = Object.assign(results, {
        version: '0.0.0.1',
      })
      spyOn(StoreUpdate, '_triggerAlertForUpdate')
      StoreUpdate._triggerAlertIfEligible(results)
      expect(StoreUpdate._triggerAlertForUpdate).not.toHaveBeenCalled()
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
