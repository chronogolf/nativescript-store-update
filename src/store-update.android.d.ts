import { StoreUpdateCommon } from "./store-update.common";
import { IStoreUpdateConfig } from './interfaces';
export * from "./constants";
export interface GoogleStoreResult {
    version: string;
    minimumOsVersion: string;
    currentVersionReleaseDate: string;
}
export declare class StoreUpdate extends StoreUpdateCommon {
    private static _instance;
    constructor(config: IStoreUpdateConfig);
    checkForUpdate(): void;
    private _parseResults(result);
    private _triggerAlertForUpdate(version);
    private _launchPlayStore();
}
