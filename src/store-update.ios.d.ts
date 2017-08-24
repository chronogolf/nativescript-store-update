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
export * from "./constants";
export declare class StoreUpdate extends StoreUpdateCommon {
    constructor();
    init(initParams: any): void;
    checkForUpdate(): void;
    private _parseResults(data);
    private _showAlertForUpdate(result);
    private _launchAppStore(appId);
    private _getItunesLookupUrl();
}
