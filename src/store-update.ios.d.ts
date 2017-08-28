import { StoreUpdateCommon } from "./store-update.common";
import { IStoreUpdateConfig } from "./interfaces";
export * from "./constants";
export declare class StoreUpdate extends StoreUpdateCommon {
    private static _instance;
    constructor(config: IStoreUpdateConfig);
    checkForUpdate(): void;
    private _extendResults(result);
    private _triggerAlertIfEligible(result);
    protected _openStore(): void;
}
