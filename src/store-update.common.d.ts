import { ConfirmOptions } from "tns-core-modules/ui/dialogs";
export declare class StoreUpdateCommon {
    majorUpdateAlertType: number;
    minorUpdateAlertType: number;
    patchUpdateAlertType: number;
    revisionUpdateAlertType: number;
    notifyNbDaysAfterRelease: number;
    countryCode: string;
    constructor();
    readonly bundleId: string;
    readonly localVersionNumber: string;
    protected _isEligibleForUpdate({version, currentVersionReleaseDate, minimumOsVersion, systemVersion}: {
        version: any;
        currentVersionReleaseDate: any;
        minimumOsVersion: any;
        systemVersion: any;
    }): boolean;
    protected _setVersionAsSkipped(version: string): void;
    protected _getAlertTypeForVersion(currentAppStoreVersion: string): number;
    protected _buildDialogOptions({skippable}?: {
        skippable?: boolean;
    }): ConfirmOptions;
    private _isAppStoreVersionNewer(versionsInStore);
    private _isCurrentVersionSkipped(currentAppStoreVersion);
    private _hasBeenReleasedLongerThanDelay(releaseDate);
    private _isUpdateCompatibleWithDeviceOS(deviceVersion, minimumRequiredOSVersion);
    private _getUpdateTypeForVersion(currentAppStoreVersion);
}
