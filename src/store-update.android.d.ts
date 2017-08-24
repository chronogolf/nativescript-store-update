import { StoreUpdateCommon } from "./store-update.common";
export * from "./constants";
export interface GoogleStoreResult {
    version: string;
    minimumOsVersion: string;
    currentVersionReleaseDate: string;
}
export declare class StoreUpdate extends StoreUpdateCommon {
    constructor();
    init(initParams: any): void;
    checkForUpdate(): void;
    private _parseResults(result);
    private _triggerAlertForUpdate(version);
    private _launchPlayStore();
}
