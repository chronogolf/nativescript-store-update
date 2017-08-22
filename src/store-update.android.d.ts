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
    private _appWasUpdated(storeDate);
    private _checkAppVersion(versions);
    private _showMajorUpdateAlert(versions);
    private _showMinorUpdateAlert(versions);
    private _showPatchUpdateAlert(versions);
}
