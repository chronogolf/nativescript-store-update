import { Common } from './store-update.common';
export interface AppleStoreInfos {
    resultCount: number;
    results: AppleStoreResult[];
}
export interface AppleStoreResult {
    bundleId: string;
    trackId: number;
    version: string;
    releaseDate: string;
    minimumOsVersion: string;
    currentVersionReleaseDate: string;
}
export declare class StoreUpdate extends Common {
    private ITUNES_BASE_URL;
    private BUNDLE_ID;
    appID: string;
    currentInstalledVersion: string;
    currentAppStoreVersion: string;
    updateAvailableMessage: string;
    theNewVersionMessage: string;
    updateButtonText: string;
    nextTimeButtonText: string;
    skipButtonText: string;
    countryCode: string;
    _showAlertAfterCurrentVersionHasBeenReleasedForDays: number;
    constructor();
    versionNumber(): any;
    checkForUpdate(): void;
    private _isUpdateCompatibleWithDeviceOS(appData);
    private _parseResults(data);
    private _isAppStoreVersionNewer(currentAppStoreVersion);
    private _launchAppStore(appID);
    private _getItunesLookupUrl();
    private _isVersionHigher(left, right);
}
