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

  constructor(config?: StoreUpdateConfig) {
    this.majorUpdateAlertType     = config.majorUpdateAlertType     || AlertTypesConstant.FORCE;
    this.minorUpdateAlertType     = config.minorUpdateAlertType     || AlertTypesConstant.OPTION;
    this.patchUpdateAlertType     = config.patchUpdateAlertType     || AlertTypesConstant.NONE;
    this.revisionUpdateAlertType  = config.revisionUpdateAlertType  || AlertTypesConstant.NONE;
    this.notifyNbDaysAfterRelease = config.notifyNbDaysAfterRelease || 3;
  }
}
