import { StoreUpdateCommon } from "./store-update.common";

export * from "./constants";

export declare class StoreUpdate extends StoreUpdateCommon {
  countryCode: string;
  majorUpdateAlertType: number;
  minorUpdateAlertType: number;
  patchUpdateAlertType: number;
  revisionUpdateAlertType: number;
  notifyNbDaysAfterRelease: number;
  constructor();
  checkForUpdate(): void;
  readonly appId: string;
  readonly localVersionNumber: string;
}
