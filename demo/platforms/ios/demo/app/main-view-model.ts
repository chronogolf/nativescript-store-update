import { Observable } from 'tns-core-modules/data/observable';
import { StoreUpdate } from 'nativescript-store-update';

export class HelloWorldModel extends Observable {
  public message: string;
  private storeUpdate: StoreUpdate;

  constructor() {
    super();

    this.storeUpdate = new StoreUpdate();
    this.message = this.storeUpdate.message;
  }
}
