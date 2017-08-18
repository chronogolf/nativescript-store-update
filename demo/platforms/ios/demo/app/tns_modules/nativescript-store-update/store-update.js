"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var dialogs = require("tns-core-modules/ui/dialogs");
var store_update_common_1 = require("./store-update.common");
var http = require('http');
var utils = require('utils/utils');
var StoreUpdate = (function (_super) {
    __extends(StoreUpdate, _super);
    function StoreUpdate() {
        var _this = _super.call(this) || this;
        _this.ITUNES_BASE_URL = 'https://itunes.apple.com';
        _this.BUNDLE_ID = 'com.chronogolf.booking.chronogolf';
        _this._showAlertAfterCurrentVersionHasBeenReleasedForDays = 3;
        _this.checkForUpdate();
        return _this;
    }
    StoreUpdate.prototype.versionNumber = function () {
        return NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleShortVersionString");
    };
    StoreUpdate.prototype.checkForUpdate = function () {
        var _this = this;
        var itunesLookupUrl = this._getItunesLookupUrl();
        http.request({
            method: "GET",
            url: itunesLookupUrl,
            timeout: 2000
        })
            .then(function (result) {
            if (result.statusCode !== 200) {
                throw new Error("Unexpected HTTP status code (" + result.statusCode + ")");
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
        return this._isVersionHigher(systemVersion, requiredOSVersion) !== -1;
    };
    StoreUpdate.prototype._parseResults = function (data) {
        var _this = this;
        if (this._isUpdateCompatibleWithDeviceOS(data)) {
            console.log("Compatible for Update");
            var lastVersionCheckPerformedOnDate = moment().format();
            var results_1 = data.results;
            var releaseDateString = results_1[0].currentVersionReleaseDate;
            if (releaseDateString === null)
                return;
            var daysSinceRelease = moment(lastVersionCheckPerformedOnDate).diff(releaseDateString, 'days');
            console.log("days since release => " + daysSinceRelease);
            if (!(daysSinceRelease >= this._showAlertAfterCurrentVersionHasBeenReleasedForDays)) {
                console.log("Your app has been released for " + daysSinceRelease + " days, but we cannot prompt the user until " + this._showAlertAfterCurrentVersionHasBeenReleasedForDays + " days have passed.");
                return;
            }
            var versionsInAppStore = results_1[0].version;
            console.log("localVersion => " + this.versionNumber() + ", versionsInAppStore => " + versionsInAppStore);
            if (versionsInAppStore === null)
                return;
            if (this._isAppStoreVersionNewer(versionsInAppStore)) {
                var options = {
                    title: "Update available",
                    message: "Version " + versionsInAppStore + " is available in App Store.",
                    okButtonText: "Update",
                    neutralButtonText: "Skip"
                };
                dialogs.confirm(options).then(function (result) {
                    if (result)
                        _this._launchAppStore(results_1[0].trackId);
                });
            }
            else {
                console.log("Current Version is up-to-date");
            }
        }
        else {
            console.log("Device is incompatible with installed version of iOS.");
        }
    };
    StoreUpdate.prototype._isAppStoreVersionNewer = function (currentAppStoreVersion) {
        return true;
    };
    StoreUpdate.prototype._launchAppStore = function (appID) {
        var appStoreUrl = this.ITUNES_BASE_URL + "/app?id=" + appID;
        utils.openUrl(appStoreUrl);
    };
    StoreUpdate.prototype._getItunesLookupUrl = function () {
        var url = this.ITUNES_BASE_URL + "/lookup?bundleId=" + this.BUNDLE_ID;
        if (this.countryCode) {
            url = url + "&country=" + this.countryCode;
        }
        console.log(url);
        return url;
    };
    StoreUpdate.prototype._isVersionHigher = function (left, right) {
        var a = left.split('.');
        var b = right.split('.');
        var i = 0;
        var len = Math.max(a.length, b.length);
        for (; i < len; i++) {
            if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                return 1;
            }
            else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                return -1;
            }
        }
        return 0;
    };
    return StoreUpdate;
}(store_update_common_1.Common));
exports.StoreUpdate = StoreUpdate;
//# sourceMappingURL=store-update.js.map