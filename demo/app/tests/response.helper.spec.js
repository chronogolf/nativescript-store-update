const StoreUpdate = require('nativescript-store-update')
const ResponseHelper = StoreUpdate.ResponseHelper
const testConstants = require('./tests.constants.spec')

describe('ResponseHelper ', () => {
  describe('handleErrorStatus function', () => {
    it('returns response if status is ok', () => {
      expect(ResponseHelper.handleErrorStatus(testConstants.HTTPResponse.success)).toEqual(
        testConstants.HTTPResponse.success
      )
    })

    it('raises an error if status is an error', () => {
      expect(() => ResponseHelper.handleErrorStatus(testConstants.HTTPResponse.error)).toThrow()
    })
  })
})
