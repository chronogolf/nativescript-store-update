import { Observable } from "tns-core-modules/data/observable";
import { StoreUpdate } from "nativescript-store-update";

export class HelloWorldModel extends Observable {
  private storeUpdate: StoreUpdate;

  constructor() {
    super();

    this.storeUpdate = new StoreUpdate();

    // console.log(this.storeUpdate.localVersionNumber);
  }
}
