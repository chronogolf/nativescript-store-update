import { StoreUpdateCommon } from "./store-update.common";
import { IStoreUpdateConfig } from "./interfaces";
export * from "./constants";
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
    private static _instance;
    constructor(config: IStoreUpdateConfig);
    checkForUpdate(): void;
    private _parseResults(data);
    private _triggerAlertForUpdate(version);
    private _launchAppStore();
    private _getItunesLookupUrl();
}
