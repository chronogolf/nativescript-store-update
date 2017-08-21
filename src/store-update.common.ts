require("globals");
require("nativescript-i18n");

import { Observable } from "tns-core-modules/data/observable";
import * as app from "tns-core-modules/application";
import * as dialogs from "tns-core-modules/ui/dialogs";

import { VersionHelper } from "./helpers/version.helper";
import { AlertTypesConstant, UpdateTypesConstant } from "./constants";

declare var global: any;

export class StoreUpdateCommon {
  private _majorUpdateAlertType: number = AlertTypesConstant.FORCE;
  private _minorUpdateAlertType: number = AlertTypesConstant.OPTION;
  private _patchUpdateAlertType: number = AlertTypesConstant.NONE;
  private _revisionUpdateAlertType: number = AlertTypesConstant.NONE;

  private _notifyNbDaysAfterRelease: number = 3;

  appId: string;
  countryCode: string;
  constructor() {
    setTimeout(() => {
      dialogs.alert(`For real. It's really working :)`).then(() => console.log(`Dialog closed.`));
    }, 2000);
  }

  /*
   * Accessors
   */

  get majorUpdateAlertType(): number {
    return this._majorUpdateAlertType;
  }

  get minorUpdateAlertType(): number {
    return this._minorUpdateAlertType;
  }

  get patchUpdateAlertType(): number {
    return this._patchUpdateAlertType;
  }

  get revisionUpdateAlertType(): number {
    return this._revisionUpdateAlertType;
  }

  get notifyNbDaysAfterRelease(): number {
    return this._notifyNbDaysAfterRelease;
  }
}
