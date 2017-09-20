const moment = require('moment')
const StoreUpdateModule = require('nativescript-store-update')
const appSettings = require('tns-core-modules/application-settings')
const dialogs = require('tns-core-modules/ui/dialogs')
const platform = require('tns-core-modules/platform')
const StoreUpdate = StoreUpdateModule.StoreUpdate
const UpdateTypesConstants = StoreUpdateModule.UpdateTypesConstants
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const testConstants = require('./tests.constants.spec')

describe('StoreUpdate ', () => {

  describe('init function', () => {
    beforeAll(() => {
      StoreUpdate.init(testConstants.config)
    })

    it('should set instatiated to true', () => {
      expect(StoreUpdate.instatiated).toBe(true)
    })

    it('should set _majorUpdateAlertType to config', () => {
      expect(StoreUpdate._majorUpdateAlertType)
        .toEqual(testConstants.config.majorUpdateAlertType)
    })

    it('should set _minorUpdateAlertType to config', () => {
      expect(StoreUpdate._minorUpdateAlertType)
        .toEqual(testConstants.config.minorUpdateAlertType)
    })

    it('should set _patchUpdateAlertType to config', () => {
      expect(StoreUpdate._patchUpdateAlertType)
        .toEqual(testConstants.config.patchUpdateAlertType)
    })

    it('should set _revisionUpdateAlertType to config', () => {
      expect(StoreUpdate._revisionUpdateAlertType)
        .toEqual(testConstants.config.revisionUpdateAlertType)
    })

    it('should set _notifyNbDaysAfterRelease to config', () => {
      expect(StoreUpdate._notifyNbDaysAfterRelease)
        .toEqual(testConstants.config.notifyNbDaysAfterRelease)
    })

    it('should set _countryCode to config', () => {
      expect(StoreUpdate._countryCode)
        .toEqual(testConstants.config.countryCode)
    })

    it('should not be possible to init twice', () => {
      const newConf = Object.assign({}, testConstants.config, {
        countryCode: 'fr'
      })
      StoreUpdate.init(newConf)
      expect(StoreUpdate._countryCode).toEqual(testConstants.config.countryCode)
    })

  })

  describe('getBundleId function', () => {
    it('should return appId', () => {
      expect(StoreUpdate.getBundleId()).toEqual(testConstants.environment.appId)
    })
  })

  describe('getLocalVersionNumber function', () => {
    it('should return app version', () => {
      expect(StoreUpdate.getLocalVersionNumber()).toEqual(testConstants.environment.appVersion)
    })
  })

  describe('_isEligibleForUpdate function', () => {
    beforeAll(() => {
      appSettings.setString('lastVersionSkipped', testConstants.updates.patch)
    })
    it('should return true if new version released for long enough matching OS min versions', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: testConstants.updates.major,
        currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
        minimumOsVersion: testConstants.environment.osVersion,
        systemVersion: testConstants.environment.osVersion,
      })).toBe(true)
    })
    it('should return false if store version is older than local', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: testConstants.updates.past,
        currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
        minimumOsVersion: testConstants.environment.osVersion,
        systemVersion: testConstants.environment.osVersion,
      })).toBe(false)
    })
    it('should return false if store version is equal to local', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: testConstants.environment.appVersion,
        currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
        minimumOsVersion: testConstants.environment.osVersion,
        systemVersion: testConstants.environment.osVersion,
      })).toBe(false)
    })
    it('should return false if release date is too close', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: testConstants.updates.major,
        currentVersionReleaseDate: testConstants.dates.today,
        minimumOsVersion: testConstants.environment.osVersion,
        systemVersion: testConstants.environment.osVersion,
      })).toBe(false)
    })
    it('should return false if os version is under min version required', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: testConstants.updates.major,
        currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
        minimumOsVersion: testConstants.environment.osVersion,
        systemVersion: testConstants.os.lower,
      })).toBe(false)
    })
    it('should return false if app version was skipped', () => {
      expect(StoreUpdate._isEligibleForUpdate({
        version: testConstants.updates.patch,
        currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
        minimumOsVersion: testConstants.environment.osVersion,
        systemVersion: testConstants.environment.osVersion,
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
      const version = testConstants.updates.minor
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
      StoreUpdate._triggerAlertForUpdate(testConstants.updates.minor).then(() => {
        expect(StoreUpdate._openStore).toHaveBeenCalled()
      })
    })
    it('should skip version if not confirmed', () => {
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve(false))
      StoreUpdate._triggerAlertForUpdate(testConstants.updates.minor).then(() => {
        expect(StoreUpdate._setVersionAsSkipped).toHaveBeenCalled()
      })
    })
  })

  describe('_getAlertTypeForVersion function', () => {
    it('should return config majorUpdateAlertType for major update', () => {
      expect(StoreUpdate._getAlertTypeForVersion(testConstants.updates.major))
        .toEqual(testConstants.config.majorUpdateAlertType)
    })
    it('should return config minorUpdateAlertType for minor update', () => {
      expect(StoreUpdate._getAlertTypeForVersion(testConstants.updates.minor))
        .toEqual(testConstants.config.minorUpdateAlertType)
    })
    it('should return config patchUpdateAlertType for patch update', () => {
      expect(StoreUpdate._getAlertTypeForVersion(testConstants.updates.patch))
        .toEqual(testConstants.config.patchUpdateAlertType)
    })
    it('should return config revisionUpdateAlertType for revision update', () => {
      expect(StoreUpdate._getAlertTypeForVersion(testConstants.updates.revision))
        .toEqual(testConstants.config.revisionUpdateAlertType)
    })
  })

  describe('_buildDialogOptions function', () => {
    it('should return options with neutralButtonText by default', () => {
      expect(StoreUpdate._buildDialogOptions())
        .toEqual(testConstants.alerts.skippableOptions)
    })
    it('should return options with neutralButtonText if skippable is true', () => {
      expect(StoreUpdate._buildDialogOptions({ skippable: true }))
        .toEqual(testConstants.alerts.skippableOptions)
    })
    it('should return options without neutralButtonText if skippable is false', () => {
      expect(StoreUpdate._buildDialogOptions({ skippable: false }))
        .toEqual(testConstants.alerts.defaultOptions)
    })
  })

  describe('_showAlertForUpdate function', () => {
    beforeAll(() => {
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve())
    })
    it('should display config majorUpdateAlertType confirm for major update', () => {
      const skippable = testConstants.config.majorUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = StoreUpdate._buildDialogOptions({ skippable })
      StoreUpdate._showAlertForUpdate(testConstants.updates.major)
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
    it('should display config minorUpdateAlertType confirm for minor update', () => {
      const skippable = testConstants.config.minorUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = StoreUpdate._buildDialogOptions({ skippable })
      StoreUpdate._showAlertForUpdate(testConstants.updates.minor)
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
    it('should not display confirm for config PatchUpdate version', () => {
      StoreUpdate._showAlertForUpdate(testConstants.updates.patch)
      .catch(err => expect(err).toEqual(null))
    })
    it('should display config revisionUpdateAlertType confirm for minor update', () => {
      const skippable = testConstants.config.revisionUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = StoreUpdate._buildDialogOptions({ skippable })
      StoreUpdate._showAlertForUpdate(testConstants.updates.revision)
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
  })

  describe('_getUpdateTypeForVersion function', () => {
    it('should return MAJOR code if major update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion(testConstants.updates.major))
        .toEqual(UpdateTypesConstants.MAJOR)
    })

    it('should return MINOR code if minor update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion(testConstants.updates.minor))
        .toEqual(UpdateTypesConstants.MINOR)
    })

    it('should return PATCH code if patch update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion(testConstants.updates.patch))
        .toEqual(UpdateTypesConstants.PATCH)
    })

    it('should return REVISION code if revision update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion(testConstants.updates.revision))
        .toEqual(UpdateTypesConstants.REVISION)
    })

    it('should return -1 code if no update', () => {
      expect(StoreUpdate._getUpdateTypeForVersion(testConstants.environment.appVersion)).toEqual(-1)
    })
  })

  describe('_isUpdateCompatibleWithDeviceOS function', () => {
    it('should return true if minimum required version is null', () => {
      expect(StoreUpdate._isUpdateCompatibleWithDeviceOS(
        testConstants.environment.osVersion,
        null
      )).toBe(true)
    })

    it('should return true if os version is higher than minimum required version', () => {
      expect(StoreUpdate._isUpdateCompatibleWithDeviceOS(
        testConstants.environment.osVersion,
        testConstants.os.lower
      )).toBe(true)
    })

    it('should return true if os version is equal to minimum required version', () => {
      expect(StoreUpdate._isUpdateCompatibleWithDeviceOS(
        testConstants.environment.osVersion,
        testConstants.environment.osVersion
      )).toBe(true)
    })

    it('should return false if os version is lower than minimum required version', () => {
      expect(StoreUpdate._isUpdateCompatibleWithDeviceOS(
        testConstants.environment.osVersion,
        testConstants.os.higher
      )).toBe(false)
    })
  })

  describe('_hasBeenReleasedLongerThanDelay function', () => {
    it('should return true if release delay is superior to config', () => {
      expect(StoreUpdate._hasBeenReleasedLongerThanDelay(
        testConstants.dates.threeDaysAgo.toDate()
      )).toBe(true)
    })

    it('should return false if release delay is inferior to config', () => {
      expect(StoreUpdate._hasBeenReleasedLongerThanDelay(
        testConstants.dates.today.toDate()
      )).toBe(false)
    })

    it('should return false if no release date is given', () => {
      expect(StoreUpdate._hasBeenReleasedLongerThanDelay()).toBe(false)
    })
  })

  describe('_triggerAlertIfEligible function', () => {
    const results = {
      bundleId: testConstants.environment.appId,
      trackId: 12,
      version: testConstants.updates.major,
      minimumOsVersion: testConstants.os.lower,
      currentVersionReleaseDate: testConstants.dates.threeDaysAgo.toDate(),
      systemVersion: testConstants.environment.osVersion,
    }

    it('should call _triggerAlertForUpdate if new valid version is available', () => {
      spyOn(StoreUpdate, '_triggerAlertForUpdate')
      StoreUpdate._triggerAlertIfEligible(results)
      expect(StoreUpdate._triggerAlertForUpdate).toHaveBeenCalled()
    })

    it('should not call _triggerAlertForUpdate if no new valid version is available', () => {
      const invalidResults = Object.assign(results, {
        version: testConstants.updates.past,
      })
      spyOn(StoreUpdate, '_triggerAlertForUpdate')
      StoreUpdate._triggerAlertIfEligible(results)
      expect(StoreUpdate._triggerAlertForUpdate).not.toHaveBeenCalled()
    })
  })

  describe('_isAppStoreVersionNewer function', () => {
    it('should return true if store version is superior to local', () => {
      expect(StoreUpdate._isAppStoreVersionNewer(testConstants.updates.major)).toBe(true)
    })

    it('should return false if store version is equal to local', () => {
      expect(StoreUpdate._isAppStoreVersionNewer(testConstants.environment.appVersion)).toBe(false)
    })

    it('should return false if store version is inferior to local', () => {
      expect(StoreUpdate._isAppStoreVersionNewer(testConstants.updates.past)).toBe(false)
    })
  })

  describe('_isCurrentVersionSkipped function', () => {
    beforeAll(() => {
      appSettings.remove('lastVersionSkipped')
    })

    it('should return false if store version is not defined', () => {
      expect(StoreUpdate._isCurrentVersionSkipped(testConstants.updates.major)).toBe(false)
    })

    it('should return true if store version is matching local', () => {
      appSettings.setString('lastVersionSkipped', testConstants.updates.major)
      expect(StoreUpdate._isCurrentVersionSkipped(testConstants.updates.major)).toBe(true)
    })

    it('should return false if store version is not matching local', () => {
      expect(StoreUpdate._isCurrentVersionSkipped(testConstants.updates.minor)).toBe(false)
    })

    afterAll(() => {
      appSettings.remove('lastVersionSkipped')
    })
  })
})
