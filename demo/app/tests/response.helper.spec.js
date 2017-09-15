const StoreUpdate = require('nativescript-store-update')
const ResponseHelper = StoreUpdate.ResponseHelper

const validResponse = {
  status: 200
}
const nonValidResponse = {
  status: 404
}

describe('ResponseHelper ', function() {
  describe('handleErrorStatus function', function() {
    it('should return response if status is ok', function() {
      expect(ResponseHelper.handleErrorStatus(validResponse)).toEqual(validResponse)
    })

    it('should raise an error if status is an error', function() {
      expect(() => ResponseHelper.handleErrorStatus(nonValidResponse)).toThrow()
    })
  })
})
