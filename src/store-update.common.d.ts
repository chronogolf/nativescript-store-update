import { ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { IStoreUpdateConfig } from './interfaces';
export declare class StoreUpdateCommon {
    static instatiated: boolean;
    private static _majorUpdateAlertType;
    private static _minorUpdateAlertType;
    private static _patchUpdateAlertType;
    private static _revisionUpdateAlertType;
    private static _notifyNbDaysAfterRelease;
    protected static _countryCode: any;
    static init(config: IStoreUpdateConfig): void;
    static getBundleId(): string;
    static getLocalVersionNumber(): string;
    protected static _isEligibleForUpdate({version, currentVersionReleaseDate, minimumOsVersion, systemVersion}: {
        version: any;
        currentVersionReleaseDate: any;
        minimumOsVersion: any;
        systemVersion: any;
    }): boolean;
    protected static _openStore(): void;
    protected static _setVersionAsSkipped(version: string): void;
    protected static _triggerAlertForUpdate(version: string): void;
    protected static _getAlertTypeForVersion(currentAppStoreVersion: string): number;
    protected static _buildDialogOptions({skippable}?: {
        skippable?: boolean;
    }): ConfirmOptions;
    protected static _showAlertForUpdate(version: string): Promise<boolean>;
    private static _isAppStoreVersionNewer(storeVersion);
    private static _isCurrentVersionSkipped(currentAppStoreVersion);
    private static _hasBeenReleasedLongerThanDelay(releaseDate);
    private static _isUpdateCompatibleWithDeviceOS(deviceVersion, minimumRequiredOSVersion);
    private static _getUpdateTypeForVersion(currentAppStoreVersion);
}
