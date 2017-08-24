import { ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { IStoreUpdateConfig } from './interfaces';
export interface storeUpdateParams {
    majorUpdateAlertType: number;
    minorUpdateAlertType: number;
    patchUpdateAlertType: number;
    revisionUpdateAlertType: number;
    notifyNbDaysAfterRelease: number;
    countryCode: string;
}
export declare class StoreUpdateCommon {
    private _majorUpdateAlertType;
    private _minorUpdateAlertType;
    private _patchUpdateAlertType;
    private _revisionUpdateAlertType;
    private _notifyNbDaysAfterRelease;
    protected _countryCode: string;
    constructor(config: IStoreUpdateConfig);
    checkForUpdate(): void;
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
    protected _showAlertForUpdate(version: string): Promise<boolean>;
    private _isAppStoreVersionNewer(storeVersion);
    private _isCurrentVersionSkipped(currentAppStoreVersion);
    private _hasBeenReleasedLongerThanDelay(releaseDate);
    private _isUpdateCompatibleWithDeviceOS(deviceVersion, minimumRequiredOSVersion);
    private _getUpdateTypeForVersion(currentAppStoreVersion);
}
