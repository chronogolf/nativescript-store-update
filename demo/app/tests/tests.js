var StoreUpdate = require("nativescript-store-update").StoreUpdate;
var storeUpdate = new StoreUpdate();

describe("greet function", function() {
    it("exists", function() {
        expect(storeUpdate.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(storeUpdate.greet()).toEqual("Hello, NS");
    });
});