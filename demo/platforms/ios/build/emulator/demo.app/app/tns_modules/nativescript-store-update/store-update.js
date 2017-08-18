"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_update_common_1 = require("./store-update.common");
var appSettings = require("tns-core-modules/application-settings");
var moment = require("moment/moment");
var http = require('http');
var StoreUpdate = (function (_super) {
    __extends(StoreUpdate, _super);
    function StoreUpdate() {
        var _this = _super.call(this) || this;
        _this.ITUNES_URL = 'https://itunes.apple.com/lookup';
        _this._showAlertAfterCurrentVersionHasBeenReleasedForDays = 3;
        _this.checkForUpdate();
        console.log("this.version =>", _this.versionNumber());
        return _this;
    }
    StoreUpdate.prototype.versionNumber = function () {
        return NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleShortVersionString");
    };
    StoreUpdate.prototype.checkForUpdate = function () {
        var _this = this;
        var itunesLookupUrl = this._getItunesUrl();
        http.request({
            method: "GET",
            url: itunesLookupUrl,
            timeout: 2000
        })
            .then(function (result) {
            if (result.statusCode !== 200) {
                throw new Error("Unexpcted HTTP status code (" + result.statusCode + ")");
            }
            _this._parseResults(result.content.toJSON());
        })
            .catch(function (err) {
            console.warn("Failed Request");
            console.dir(err);
        });
    };
    StoreUpdate.prototype._isUpdateCompatibleWithDeviceOS = function (appData) {
        var results = appData.results;
        if (appData.resultCount === 0)
            return false;
        var requiredOSVersion = results[0].minimumOsVersion;
        if (requiredOSVersion === null)
            return true;
        var systemVersion = UIDevice.currentDevice.systemVersion;
        console.log("System Version :> " + systemVersion, "Required Version :> " + requiredOSVersion);
        return parseFloat(systemVersion) > parseFloat(requiredOSVersion);
    };
    StoreUpdate.prototype._parseResults = function (data) {
        if (this._isUpdateCompatibleWithDeviceOS(data)) {
            console.log("Compatible for Update");
            var lastVersionCheckPerformedOnDate = moment().format();
            appSettings.setString('lastVersionCheckPerformedOnDate', lastVersionCheckPerformedOnDate);
            var results = data.results;
            var releaseDateString = results[0].currentVersionReleaseDate;
            if (releaseDateString === null)
                return;
            var daysSinceRelease = moment(lastVersionCheckPerformedOnDate).diff(releaseDateString, 'days');
            console.log("days since release =>", daysSinceRelease);
            if (!(daysSinceRelease >= this._showAlertAfterCurrentVersionHasBeenReleasedForDays)) {
                console.log("Your app has been released for " + daysSinceRelease + " days, but we cannot prompt the user until " + this._showAlertAfterCurrentVersionHasBeenReleasedForDays + " days have passed.");
                return;
            }
            var versionsInAppStore = results[0].version;
        }
        else {
            console.log("Device is incompatible with installed verison of iOS.");
        }
    };
    StoreUpdate.prototype._getItunesUrl = function () {
        var bundleId = "com.chronogolf.booking.chronogolf";
        return this.ITUNES_URL + "?bundleId=" + bundleId;
    };
    return StoreUpdate;
}(store_update_common_1.Common));
exports.StoreUpdate = StoreUpdate;
//# sourceMappingURL=store-update.js.map