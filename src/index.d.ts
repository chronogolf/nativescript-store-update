import { StoreUpdateCommon } from './store-update.common';
import { IStoreUpdateConfig } from './interfaces';
export declare class StoreUpdate extends StoreUpdateCommon {
    private _localVersion;
    constructor(config: IStoreUpdateConfig);
    readonly localVersionNumber: string;
    checkForUpdate(): void;
    private _initAppInfos();
    private _checkAppVersion(versions);
    private _showMajorUpdateAlert(versions);
    private _showMinorUpdateAlert(versions);
    private _showPatchUpdateAlert(versions);
}
