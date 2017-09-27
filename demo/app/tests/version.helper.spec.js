const StoreUpdate = require('nativescript-store-update')
const VersionHelper = StoreUpdate.VersionHelper

describe('VersionHelper ', () => {
  describe('_compareVersions function', () => {
    it('returns 1 if a version is > b version', () => {
      expect(VersionHelper._compareVersions('2.0.0.0', '1.0.0.0')).toEqual(1)
      expect(VersionHelper._compareVersions('1.2.0.0', '1.0.0.0')).toEqual(1)
      expect(VersionHelper._compareVersions('1.0.2.0', '1.0.0.0')).toEqual(1)
    })

    it('returns -1 if a version is < b version', () => {
      expect(VersionHelper._compareVersions('1.0.0.0', '2.0.0.0')).toEqual(-1)
      expect(VersionHelper._compareVersions('1.0.0.0', '1.2.0.0')).toEqual(-1)
      expect(VersionHelper._compareVersions('1.0.0.0', '1.0.2.0')).toEqual(-1)
    })

    it('returns 0 if a version is === b version', () => {
      expect(VersionHelper._compareVersions('1.0.0.0', '1.0.0.0')).toEqual(0)
    })
  })

  describe('_isIndexSectionHigher function', () => {
    it('returns true if version section a is higher than b', () => {
      expect(VersionHelper._isIndexSectionHigher('2.0.0.0', '1.0.0.0', 0)).toBe(true)
      expect(VersionHelper._isIndexSectionHigher('1.2.0.0', '1.0.0.0', 1)).toBe(true)
      expect(VersionHelper._isIndexSectionHigher('1.0.2.0', '1.0.0.0', 2)).toBe(true)
      expect(VersionHelper._isIndexSectionHigher('1.0.0.2', '1.0.0.0', 3)).toBe(true)
    })

    it('returns false if version section a is lower than b', () => {
      expect(VersionHelper._isIndexSectionHigher('1.0.0.0', '2.0.0.0', 0)).toBe(false)
      expect(VersionHelper._isIndexSectionHigher('1.0.0.0', '1.2.0.0', 1)).toBe(false)
      expect(VersionHelper._isIndexSectionHigher('1.0.0.0', '1.0.2.0', 2)).toBe(false)
      expect(VersionHelper._isIndexSectionHigher('1.0.0.0', '1.0.0.2', 3)).toBe(false)
    })

    it(`returns false if version section doesn't exists on a`, () => {
      expect(VersionHelper._isIndexSectionHigher('2', '1.0', 1)).toBe(false)
    })

    it(`returns true if version section doesn't exists on b`, () => {
      expect(VersionHelper._isIndexSectionHigher('2.0', '1', 1)).toBe(true)
    })
  })

  describe('isHigher function', () => {
    it('returns true if version a is higher than b', () => {
      expect(VersionHelper.isHigher('2.0.0.0', '1.0.0.0')).toBe(true)
    })

    it('returns false if version a is equal to b', () => {
      expect(VersionHelper.isHigher('2.0.0.0', '2.0.0.0')).toBe(false)
    })

    it('returns false if version a is lower than b', () => {
      expect(VersionHelper.isHigher('1.0.0.0', '2.0.0.0')).toBe(false)
    })
  })

  describe('isEqualOrHigher function', () => {
    it('returns true if version a is higher than b', () => {
      expect(VersionHelper.isEqualOrHigher('2.0.0.0', '1.0.0.0')).toBe(true)
    })

    it('returns true if version a is equal to b', () => {
      expect(VersionHelper.isEqualOrHigher('2.0.0.0', '2.0.0.0')).toBe(true)
    })

    it('returns false if version a is lower than b', () => {
      expect(VersionHelper.isEqualOrHigher('1.0.0.0', '2.0.0.0')).toBe(false)
    })
  })

  describe('isMajorUpdate function', () => {
    it('returns true if major version a is higher than major b', () => {
      expect(VersionHelper.isMajorUpdate('2.0.0.0', '1.0.0.0')).toBe(true)
    })

    it('returns false if major version a is equal to major b', () => {
      expect(VersionHelper.isMajorUpdate('2.0.0.0', '2.0.0.0')).toBe(false)
    })

    it('returns false if major version a is lower than major b', () => {
      expect(VersionHelper.isMajorUpdate('1.0.0.0', '2.0.0.0')).toBe(false)
    })
  })

  describe('isMinorUpdate function', () => {
    it('returns true if minor version a is higher than minor b', () => {
      expect(VersionHelper.isMinorUpdate('1.2.0.0', '1.0.0.0')).toBe(true)
    })

    it('returns false if minor version a is equal to minor b', () => {
      expect(VersionHelper.isMinorUpdate('1.2.0.0', '1.2.0.0')).toBe(false)
    })

    it('returns false if minor version a is lower than minor b', () => {
      expect(VersionHelper.isMinorUpdate('1.0.0.0', '1.2.0.0')).toBe(false)
    })
  })

  describe('isPatchUpdate function', () => {
    it('returns true if patch version a is higher than patch b', () => {
      expect(VersionHelper.isPatchUpdate('1.0.2.0', '1.0.0.0')).toBe(true)
    })

    it('returns false if patch version a is equal to patch b', () => {
      expect(VersionHelper.isPatchUpdate('1.0.2.0', '1.0.2.0')).toBe(false)
    })

    it('returns false if patch version a is lower than patch b', () => {
      expect(VersionHelper.isPatchUpdate('1.0.0.0', '1.0.2.0')).toBe(false)
    })
  })

  describe('isRevisionUpdate function', () => {
    it('returns true if revision version a is higher than revision b', () => {
      expect(VersionHelper.isRevisionUpdate('1.0.0.2', '1.0.0.0')).toBe(true)
    })

    it('returns false if revision version a is equal to revision b', () => {
      expect(VersionHelper.isRevisionUpdate('1.0.0.2', '1.0.0.2')).toBe(false)
    })

    it('returns false if revision version a is lower than revision b', () => {
      expect(VersionHelper.isRevisionUpdate('1.0.0.0', '1.0.0.2')).toBe(false)
    })
  })
})
