import { StoreUpdateCommon } from "./store-update.common";
export * from "./constants";
export interface GoogleStoreResult {
    version: string;
    minimumOsVersion: string;
    currentVersionReleaseDate: string;
}
export declare class StoreUpdate extends StoreUpdateCommon {
    constructor();
    checkForUpdate(): void;
    private _parseResults(result);
}
