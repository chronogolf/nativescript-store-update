import { StoreUpdateCommon } from "./store-update.common";

export declare class StoreUpdate extends StoreUpdateCommon {
  appId: string;
  countryCode: string;
  constructor();
  readonly majorUpdateAlertType: number;
  readonly minorUpdateAlertType: number;
  readonly patchUpdateAlertType: number;
  readonly revisionUpdateAlertType: number;
  readonly notifyNbDaysAfterRelease: number;
}
