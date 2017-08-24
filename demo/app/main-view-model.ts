import { Observable } from "tns-core-modules/data/observable";
import { StoreUpdate, AlertTypesConstant } from "nativescript-store-update";

export class HelloWorldModel extends Observable {
  private storeUpdate: StoreUpdate;

  constructor() {
    super();

    this.storeUpdate = new StoreUpdate();

    this.storeUpdate.notifyNbDaysAfterRelease = 1;
    this.storeUpdate.majorUpdateAlertType = AlertTypesConstant.OPTION;
    this.storeUpdate.checkForUpdate();
  }
}
