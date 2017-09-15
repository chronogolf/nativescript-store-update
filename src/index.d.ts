import { StoreUpdateCommon } from "./store-update.common";
import { IStoreUpdateConfig } from './interfaces'
export * from "./constants";
export * from "./helpers";
export * from "./interfaces";
export declare class StoreUpdate extends StoreUpdateCommon {
    private static _checkHasTimeouted;
    private static _timeoutChecker;
    private static _looperChecker;
    static checkForUpdate(): void;
    static init(config: IStoreUpdateConfig): void;
    static getBundleId(): string;
    static getLocalVersionNumber(): string;
    private static _extendResults(result);
    private static _triggerAlertIfEligible(result);
    protected static _openStore(): void;
}
