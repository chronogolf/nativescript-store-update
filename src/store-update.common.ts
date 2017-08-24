require("globals");
require("nativescript-i18n");

import { Observable } from "tns-core-modules/data/observable";
import * as app from "tns-core-modules/application";
import * as dialogs from "tns-core-modules/ui/dialogs";

import { VersionHelper } from "./helpers";
import { IStoreUpdateConfig } from './interfaces'

declare var global: any;

export class StoreUpdateCommon {
  private static _instance;
  private _majorUpdateAlertType    : number;
  private _minorUpdateAlertType    : number;
  private _patchUpdateAlertType    : number;
  private _revisionUpdateAlertType : number;
  private _notifyNbDaysAfterRelease: number;

  appId: string;
  countryCode: string;
  constructor(config: IStoreUpdateConfig) {
    if (!config) throw new Error(`No config provided to store update plugin.`)
    if (StoreUpdateCommon._instance) {
      return StoreUpdateCommon._instance
    }
    StoreUpdateCommon._instance = this
    this._majorUpdateAlertType     = config.majorUpdateAlertType
    this._minorUpdateAlertType     = config.minorUpdateAlertType
    this._patchUpdateAlertType     = config.patchUpdateAlertType
    this._revisionUpdateAlertType  = config.revisionUpdateAlertType
    this._notifyNbDaysAfterRelease = config.notifyNbDaysAfterRelease

    // Resumed is called both at launch and resume of the app
    app.on(app.resumeEvent, () => {
      console.log('App started or resumed')
    })
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
