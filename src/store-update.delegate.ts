import * as app from 'tns-core-modules/application'
import { StoreUpdate } from './'

export class ForegroundDelegage extends UIResponder implements UIApplicationDelegate {
  public static ObjCProtocols = [UIApplicationDelegate]

  public applicationDidFinishLaunchingWithOptions(): boolean {
    StoreUpdate.checkForUpdate()
    return true
  }

  public applicationWillEnterForeground(): void {
    StoreUpdate.checkForUpdate()
  }
}
