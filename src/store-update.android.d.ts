import { StoreUpdateCommon } from './store-update.common';
export declare class StoreUpdate extends StoreUpdateCommon {
    appInfo: {
        version: string;
        build: string;
    };
    constructor();
    readonly localVersionNumber: string;
    checkForUpdate(): void;
    private _initAppInfos();
    private _checkAppDate(storeDate);
    private _checkAppVersion(storeVersion);
}
