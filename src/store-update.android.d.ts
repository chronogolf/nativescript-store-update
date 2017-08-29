import { StoreUpdateCommon } from "./store-update.common";
export * from "./constants";
export declare class StoreUpdate extends StoreUpdateCommon {
    private static _checkHasTimeouted;
    private static _timeoutChecker;
    private static _looperChecker;
    static checkForUpdate(): void;
    private static _extendResults(result);
    private static _triggerAlertIfEligible(result);
    protected static _openStore(): void;
}
