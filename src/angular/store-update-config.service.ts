import { Injectable } from "@angular/core";
import { IStoreUpdateConfig } from "../interfaces";
import {
  AlertTypesConstant,
  UpdateTypesConstant
} from "../constants";

@Injectable()
export class StoreUpdateConfig implements IStoreUpdateConfig {
  majorUpdateAlertType    : number
  minorUpdateAlertType    : number
  patchUpdateAlertType    : number
  revisionUpdateAlertType : number
  notifyNbDaysAfterRelease: number

  constructor(config?: IStoreUpdateConfig) {
    this.majorUpdateAlertType     = config.majorUpdateAlertType;
    this.minorUpdateAlertType     = config.minorUpdateAlertType;
    this.patchUpdateAlertType     = config.patchUpdateAlertType;
    this.revisionUpdateAlertType  = config.revisionUpdateAlertType;
    this.notifyNbDaysAfterRelease = config.notifyNbDaysAfterRelease;
  }
}
