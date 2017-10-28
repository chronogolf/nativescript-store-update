const moment = require('moment')
const StoreUpdateModule = require('nativescript-store-update')
const appSettings = require('tns-core-modules/application-settings')
const dialogs = require('tns-core-modules/ui/dialogs')
const platform = require('tns-core-modules/platform')
const StoreUpdate = StoreUpdateModule.StoreUpdate
const UpdateTypesConstants = StoreUpdateModule.UpdateTypesConstants
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const testConstants = require('./tests.constants.spec')

let storeUpdateCommon

describe('StoreUpdateCommon ', () => {

  beforeAll(() => {
    StoreUpdate.init(testConstants.config)
    storeUpdateCommon = StoreUpdate._common
  })

  describe('init function', () => {

    it('sets _majorUpdateAlertType to config', () => {
      expect(storeUpdateCommon._majorUpdateAlertType).toEqual(testConstants.config.majorUpdateAlertType)
    })

    it('sets _minorUpdateAlertType to config', () => {
      expect(storeUpdateCommon._minorUpdateAlertType).toEqual(testConstants.config.minorUpdateAlertType)
    })

    it('sets _patchUpdateAlertType to config', () => {
      expect(storeUpdateCommon._patchUpdateAlertType).toEqual(testConstants.config.patchUpdateAlertType)
    })

    it('sets _revisionUpdateAlertType to config', () => {
      expect(storeUpdateCommon._revisionUpdateAlertType).toEqual(
        testConstants.config.revisionUpdateAlertType
      )
    })

    it('sets _notifyNbDaysAfterRelease to config', () => {
      expect(storeUpdateCommon._notifyNbDaysAfterRelease).toEqual(
        testConstants.config.notifyNbDaysAfterRelease
      )
    })

    it('sets _countryCode to config', () => {
      expect(storeUpdateCommon.countryCode).toEqual(testConstants.config.countryCode)
    })
  })

  describe('getBundleId function', () => {
    it('returns appId', () => {
      expect(storeUpdateCommon.getBundleId()).toEqual(testConstants.environment.appId)
    })
  })

  describe('getLocalVersionNumber function', () => {
    it('returns app version', () => {
      expect(storeUpdateCommon.getLocalVersionNumber()).toEqual(testConstants.environment.appVersion)
    })
  })

  describe('isEligibleForUpdate function', () => {
    beforeAll(() => {
      appSettings.setString('lastVersionSkipped', testConstants.updates.patch)
    })
    it('returns true if new version released for long enough matching OS min versions', () => {
      expect(
        storeUpdateCommon.isEligibleForUpdate({
          version: testConstants.updates.major,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(true)
    })
    it('returns false if store version is older than local', () => {
      expect(
        storeUpdateCommon.isEligibleForUpdate({
          version: testConstants.updates.past,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(false)
    })
    it('returns false if store version is equal to local', () => {
      expect(
        storeUpdateCommon.isEligibleForUpdate({
          version: testConstants.environment.appVersion,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(false)
    })
    it('returns false if release date is too close', () => {
      expect(
        storeUpdateCommon.isEligibleForUpdate({
          version: testConstants.updates.major,
          currentVersionReleaseDate: testConstants.dates.today,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(false)
    })
    it('returns false if os version is under min version required', () => {
      expect(
        storeUpdateCommon.isEligibleForUpdate({
          version: testConstants.updates.major,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.os.lower,
        })
      ).toBe(false)
    })
    it('returns false if app version was skipped', () => {
      expect(
        storeUpdateCommon.isEligibleForUpdate({
          version: testConstants.updates.patch,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(false)
    })
    afterAll(() => {
      appSettings.remove('lastVersionSkipped')
    })
  })

  describe('setVersionAsSkipped function', () => {
    beforeAll(() => {
      spyOn(appSettings, 'setString')
    })
    it('sets skipped version in app settings', () => {
      const version = testConstants.updates.minor
      storeUpdateCommon.setVersionAsSkipped(version)
      expect(appSettings.setString).toHaveBeenCalledWith('lastVersionSkipped', version)
    })
  })

  describe('triggerAlertForUpdate function', () => {
    beforeAll(() => {
      spyOn(storeUpdateCommon, '_onConfirmed')
      spyOn(storeUpdateCommon, 'setVersionAsSkipped')
    })
    it('opens store if confirmed', () => {
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve(true))
      storeUpdateCommon.triggerAlertForUpdate(testConstants.updates.minor).then(() => {
        expect(storeUpdateCommon._onConfirmed).toHaveBeenCalled()
      })
    })
    it('skips version if not confirmed', () => {
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve(false))
      storeUpdateCommon.triggerAlertForUpdate(testConstants.updates.minor).then(() => {
        expect(storeUpdateCommon.setVersionAsSkipped).toHaveBeenCalled()
      })
    })
  })

  describe('getAlertTypeForVersion function', () => {
    it('returns config majorUpdateAlertType for major update', () => {
      expect(storeUpdateCommon.getAlertTypeForVersion(testConstants.updates.major)).toEqual(
        testConstants.config.majorUpdateAlertType
      )
    })
    it('returns config minorUpdateAlertType for minor update', () => {
      expect(storeUpdateCommon.getAlertTypeForVersion(testConstants.updates.minor)).toEqual(
        testConstants.config.minorUpdateAlertType
      )
    })
    it('returns config patchUpdateAlertType for patch update', () => {
      expect(storeUpdateCommon.getAlertTypeForVersion(testConstants.updates.patch)).toEqual(
        testConstants.config.patchUpdateAlertType
      )
    })
    it('returns config revisionUpdateAlertType for revision update', () => {
      expect(storeUpdateCommon.getAlertTypeForVersion(testConstants.updates.revision)).toEqual(
        testConstants.config.revisionUpdateAlertType
      )
    })
  })

  describe('buildDialogOptions function', () => {
    it('returns options with neutralButtonText by default', () => {
      expect(storeUpdateCommon.buildDialogOptions()).toEqual(testConstants.alerts.skippableOptions)
    })
    it('returns options with neutralButtonText if skippable is true', () => {
      expect(storeUpdateCommon.buildDialogOptions({ skippable: true })).toEqual(
        testConstants.alerts.skippableOptions
      )
    })
    it('returns options without neutralButtonText if skippable is false', () => {
      expect(storeUpdateCommon.buildDialogOptions({ skippable: false })).toEqual(
        testConstants.alerts.defaultOptions
      )
    })
  })

  describe('showAbuildDialogOptionslertForUpdate function', () => {
    beforeAll(() => {
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve())
    })
    it('displays config majorUpdateAlertType confirm for major update', () => {
      const skippable = testConstants.config.majorUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = storeUpdateCommon.buildDialogOptions({ skippable })
      storeUpdateCommon.showAlertForUpdate(testConstants.updates.major)
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
    it('displays config minorUpdateAlertType confirm for minor update', () => {
      const skippable = testConstants.config.minorUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = storeUpdateCommon.buildDialogOptions({ skippable })
      storeUpdateCommon.showAlertForUpdate(testConstants.updates.minor)
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
    it('does not display confirm for config PatchUpdate version', () => {
      storeUpdateCommon.showAlertForUpdate(testConstants.updates.patch).catch(err =>
        expect(err).toEqual(null)
      )
    })
    it('displays config revisionUpdateAlertType confirm for minor update', () => {
      const skippable = testConstants.config.revisionUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = storeUpdateCommon.buildDialogOptions({ skippable })
      storeUpdateCommon.showAlertForUpdate(testConstants.updates.revision)
      expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
  })

  describe('_getUpdateTypeForVersion function', () => {
    it('returns MAJOR code if major update', () => {
      expect(storeUpdateCommon._getUpdateTypeForVersion(testConstants.updates.major)).toEqual(
        UpdateTypesConstants.MAJOR
      )
    })

    it('returns MINOR code if minor update', () => {
      expect(storeUpdateCommon._getUpdateTypeForVersion(testConstants.updates.minor)).toEqual(
        UpdateTypesConstants.MINOR
      )
    })

    it('returns PATCH code if patch update', () => {
      expect(storeUpdateCommon._getUpdateTypeForVersion(testConstants.updates.patch)).toEqual(
        UpdateTypesConstants.PATCH
      )
    })

    it('returns REVISION code if revision update', () => {
      expect(storeUpdateCommon._getUpdateTypeForVersion(testConstants.updates.revision)).toEqual(
        UpdateTypesConstants.REVISION
      )
    })

    it('returns -1 code if no update', () => {
      expect(storeUpdateCommon._getUpdateTypeForVersion(testConstants.environment.appVersion)).toEqual(-1)
    })
  })

  describe('_isUpdateCompatibleWithDeviceOS function', () => {
    it('returns true if minimum required version is null', () => {
      expect(
        storeUpdateCommon._isUpdateCompatibleWithDeviceOS(testConstants.environment.osVersion, null)
      ).toBe(true)
    })

    it('returns true if os version is higher than minimum required version', () => {
      expect(
        storeUpdateCommon._isUpdateCompatibleWithDeviceOS(
          testConstants.environment.osVersion,
          testConstants.os.lower
        )
      ).toBe(true)
    })

    it('returns true if os version is equal to minimum required version', () => {
      expect(
        storeUpdateCommon._isUpdateCompatibleWithDeviceOS(
          testConstants.environment.osVersion,
          testConstants.environment.osVersion
        )
      ).toBe(true)
    })

    it('returns false if os version is lower than minimum required version', () => {
      expect(
        storeUpdateCommon._isUpdateCompatibleWithDeviceOS(
          testConstants.environment.osVersion,
          testConstants.os.higher
        )
      ).toBe(false)
    })
  })

  describe('_hasBeenReleasedLongerThanDelay function', () => {
    it('returns true if release delay is superior to config', () => {
      expect(
        storeUpdateCommon._hasBeenReleasedLongerThanDelay(testConstants.dates.threeDaysAgo.toDate())
      ).toBe(true)
    })

    it('returns false if release delay is inferior to config', () => {
      expect(storeUpdateCommon._hasBeenReleasedLongerThanDelay(testConstants.dates.today.toDate())).toBe(
        false
      )
    })

    it('returns false if no release date is given', () => {
      expect(storeUpdateCommon._hasBeenReleasedLongerThanDelay()).toBe(false)
    })
  })

  describe('triggerAlertIfEligible function', () => {
    const results = {
      bundleId: testConstants.environment.appId,
      trackId: 12,
      version: testConstants.updates.major,
      minimumOsVersion: testConstants.os.lower,
      currentVersionReleaseDate: testConstants.dates.threeDaysAgo.toDate(),
      systemVersion: testConstants.environment.osVersion,
    }

    it('calls triggerAlertForUpdate if new valid version is available', () => {
      spyOn(storeUpdateCommon, 'triggerAlertForUpdate')
      storeUpdateCommon.triggerAlertIfEligible(results)
      expect(storeUpdateCommon.triggerAlertForUpdate).toHaveBeenCalled()
    })

    it('does not call triggerAlertForUpdate if no new valid version is available', () => {
      const invalidResults = Object.assign(results, {
        version: testConstants.updates.past,
      })
      spyOn(storeUpdateCommon, 'triggerAlertForUpdate')
      storeUpdateCommon.triggerAlertIfEligible(results)
      expect(storeUpdateCommon.triggerAlertForUpdate).not.toHaveBeenCalled()
    })
  })

  describe('_isAppStoreVersionNewer function', () => {
    it('returns true if store version is superior to local', () => {
      expect(storeUpdateCommon._isAppStoreVersionNewer(testConstants.updates.major)).toBe(true)
    })

    it('returns false if store version is equal to local', () => {
      expect(storeUpdateCommon._isAppStoreVersionNewer(testConstants.environment.appVersion)).toBe(false)
    })

    it('returns false if store version is inferior to local', () => {
      expect(storeUpdateCommon._isAppStoreVersionNewer(testConstants.updates.past)).toBe(false)
    })
  })

  describe('_isCurrentVersionSkipped function', () => {
    beforeAll(() => {
      appSettings.remove('lastVersionSkipped')
    })

    it('returns false if store version is not defined', () => {
      expect(storeUpdateCommon._isCurrentVersionSkipped(testConstants.updates.major)).toBe(false)
    })

    it('returns true if store version is matching local', () => {
      appSettings.setString('lastVersionSkipped', testConstants.updates.major)
      expect(storeUpdateCommon._isCurrentVersionSkipped(testConstants.updates.major)).toBe(true)
    })

    it('returns false if store version is not matching local', () => {
      expect(storeUpdateCommon._isCurrentVersionSkipped(testConstants.updates.minor)).toBe(false)
    })

    afterAll(() => {
      appSettings.remove('lastVersionSkipped')
    })
  })
})
