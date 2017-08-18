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
    private _majorUpdateAlertType;
    private _minorUpdateAlertType;
    private _patchUpdateAlertType;
    private _revisionUpdateAlertType;
    appID: string;
    updateAvailableMessage: string;
    countryCode: string;
    notifyNbDaysAfterRelease: number;
    constructor();
    localVersionNumber(): any;
    checkForUpdate(): void;
    private _isUpdateCompatibleWithDeviceOS(result);
    private _hasBeenReleasedLongerThanDelay(result);
    private _isAppStoreVersionNewer(result);
    private _parseResults(data);
    private _setupNotificationForUpdate(result);
    private _showAlertIfCurrentAppStoreVersionNotSkipped(result);
    private _isCurrentVersionSkipped(currentAppStoreVersion);
    private _getUpdateTypeForVersion(currentAppStoreVersion);
    private _getAlertTypeForVersion(currentAppStoreVersion);
    private _showAlertForAppStoreVersion(result);
    private _launchAppStore(appID);
    private _getItunesLookupUrl();
}
