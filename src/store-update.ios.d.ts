import { StoreUpdateCommon } from "./store-update.common";
export interface AppleStoreInfos {
    resultCount: number;
    results: AppleStoreResult[];
}
export interface AppleStoreResult {
    bundleId: string;
    trackId: number;
    version: string;
    minimumOsVersion: string;
    currentVersionReleaseDate: string;
}
export declare class StoreUpdate extends StoreUpdateCommon {
    private ITUNES_BASE_URL;
    private BUNDLE_ID;
    constructor();
    readonly localVersionNumber: string;
    checkForUpdate(): void;
    private _parseResults(data);
    private _isUpdateCompatibleWithDeviceOS(result);
    private _hasBeenReleasedLongerThanDelay(result);
    private _isAppStoreVersionNewer(result);
    private _setupNotificationForUpdate(result);
    private _showAlertIfCurrentAppStoreVersionNotSkipped(result);
    private _isCurrentVersionSkipped(currentAppStoreVersion);
    private _showAlertForAppStoreVersion(result);
    private _getUpdateTypeForVersion(currentAppStoreVersion);
    private _getAlertTypeForVersion(currentAppStoreVersion);
    private _buildDialogOptions({skippable}?);
    private _launchAppStore(appId);
    private _getItunesLookupUrl();
}
