import { IStoreUpdateConfig } from './interfaces';
export declare class StoreUpdateCommon {
    private static _instance;
    private _majorUpdateAlertType;
    private _minorUpdateAlertType;
    private _patchUpdateAlertType;
    private _revisionUpdateAlertType;
    private _notifyNbDaysAfterRelease;
    appId: string;
    countryCode: string;
    constructor(config: IStoreUpdateConfig);
    readonly majorUpdateAlertType: number;
    readonly minorUpdateAlertType: number;
    readonly patchUpdateAlertType: number;
    readonly revisionUpdateAlertType: number;
    readonly notifyNbDaysAfterRelease: number;
}
