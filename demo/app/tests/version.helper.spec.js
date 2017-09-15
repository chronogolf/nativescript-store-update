const StoreUpdate = require('nativescript-store-update')
const VersionHelper = StoreUpdate.VersionHelper

describe('VersionHelper ', function() {
  describe('_compareVersions function', function() {
    it('should return 1 if a version is > b version', function() {
      expect(VersionHelper._compareVersions('2.0.0.0', '1.0.0.0')).toEqual(1)
      expect(VersionHelper._compareVersions('1.2.0.0', '1.0.0.0')).toEqual(1)
      expect(VersionHelper._compareVersions('1.0.2.0', '1.0.0.0')).toEqual(1)
    })

    it('should return -1 if a version is < b version', function() {
      expect(VersionHelper._compareVersions('1.0.0.0', '2.0.0.0')).toEqual(-1)
      expect(VersionHelper._compareVersions('1.0.0.0', '1.2.0.0')).toEqual(-1)
      expect(VersionHelper._compareVersions('1.0.0.0', '1.0.2.0')).toEqual(-1)
    })

    it('should return 0 if a version is === b version', function() {
      expect(VersionHelper._compareVersions('1.0.0.0', '1.0.0.0')).toEqual(0)
    })
  })

  describe('_isIndexSectionHigher function', function() {
    it('should return true if version section a is higher than b', function() {
      expect(VersionHelper._isIndexSectionHigher('2.0.0.0', '1.0.0.0', 0)).toBe(true)
      expect(VersionHelper._isIndexSectionHigher('1.2.0.0', '1.0.0.0', 1)).toBe(true)
      expect(VersionHelper._isIndexSectionHigher('1.0.2.0', '1.0.0.0', 2)).toBe(true)
      expect(VersionHelper._isIndexSectionHigher('1.0.0.2', '1.0.0.0', 3)).toBe(true)
    })

    it('should return false if version section a is lower than b', function() {
      expect(VersionHelper._isIndexSectionHigher('1.0.0.0', '2.0.0.0', 0)).toBe(false)
      expect(VersionHelper._isIndexSectionHigher('1.0.0.0', '1.2.0.0', 1)).toBe(false)
      expect(VersionHelper._isIndexSectionHigher('1.0.0.0', '1.0.2.0', 2)).toBe(false)
      expect(VersionHelper._isIndexSectionHigher('1.0.0.0', '1.0.0.2', 3)).toBe(false)
    })

    it(`should return false if version section doesn't exists on a`, function() {
      expect(VersionHelper._isIndexSectionHigher('2', '1.0', 1)).toBe(false)
    })

    it(`should return true if version section doesn't exists on b`, function() {
      expect(VersionHelper._isIndexSectionHigher('2.0', '1', 1)).toBe(true)
    })
  })

  describe('isHigher function', function() {
    it('should return true if version a is higher than b', function() {
      expect(VersionHelper.isHigher('2.0.0.0', '1.0.0.0')).toBe(true)
    })

    it('should return false if version a is equal to b', function() {
      expect(VersionHelper.isHigher('2.0.0.0', '2.0.0.0')).toBe(false)
    })

    it('should return false if version a is lower than b', function() {
      expect(VersionHelper.isHigher('1.0.0.0', '2.0.0.0')).toBe(false)
    })
  })

  describe('isEqualOrHigher function', function() {
    it('should return true if version a is higher than b', function() {
      expect(VersionHelper.isEqualOrHigher('2.0.0.0', '1.0.0.0')).toBe(true)
    })

    it('should return true if version a is equal to b', function() {
      expect(VersionHelper.isEqualOrHigher('2.0.0.0', '2.0.0.0')).toBe(true)
    })

    it('should return false if version a is lower than b', function() {
      expect(VersionHelper.isEqualOrHigher('1.0.0.0', '2.0.0.0')).toBe(false)
    })
  })

  describe('isMajorUpdate function', function() {
    it('should return true if major version a is higher than major b', function() {
      expect(VersionHelper.isMajorUpdate('2.0.0.0', '1.0.0.0')).toBe(true)
    })

    it('should return false if major version a is equal to major b', function() {
      expect(VersionHelper.isMajorUpdate('2.0.0.0', '2.0.0.0')).toBe(false)
    })

    it('should return false if major version a is lower than major b', function() {
      expect(VersionHelper.isMajorUpdate('1.0.0.0', '2.0.0.0')).toBe(false)
    })
  })

  describe('isMinorUpdate function', function() {
    it('should return true if minor version a is higher than minor b', function() {
      expect(VersionHelper.isMinorUpdate('1.2.0.0', '1.0.0.0')).toBe(true)
    })

    it('should return false if minor version a is equal to minor b', function() {
      expect(VersionHelper.isMinorUpdate('1.2.0.0', '1.2.0.0')).toBe(false)
    })

    it('should return false if minor version a is lower than minor b', function() {
      expect(VersionHelper.isMinorUpdate('1.0.0.0', '1.2.0.0')).toBe(false)
    })
  })

  describe('isPatchUpdate function', function() {
    it('should return true if patch version a is higher than patch b', function() {
      expect(VersionHelper.isPatchUpdate('1.0.2.0', '1.0.0.0')).toBe(true)
    })

    it('should return false if patch version a is equal to patch b', function() {
      expect(VersionHelper.isPatchUpdate('1.0.2.0', '1.0.2.0')).toBe(false)
    })

    it('should return false if patch version a is lower than patch b', function() {
      expect(VersionHelper.isPatchUpdate('1.0.0.0', '1.0.2.0')).toBe(false)
    })
  })

  describe('isRevisionUpdate function', function() {
    it('should return true if revision version a is higher than revision b', function() {
      expect(VersionHelper.isRevisionUpdate('1.0.0.2', '1.0.0.0')).toBe(true)
    })

    it('should return false if revision version a is equal to revision b', function() {
      expect(VersionHelper.isRevisionUpdate('1.0.0.2', '1.0.0.2')).toBe(false)
    })

    it('should return false if revision version a is lower than revision b', function() {
      expect(VersionHelper.isRevisionUpdate('1.0.0.0', '1.0.0.2')).toBe(false)
    })
  })
})
