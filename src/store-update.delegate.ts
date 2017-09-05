import * as app from 'tns-core-modules/application'
import { StoreUpdate } from './'

export class ForegroundDelegage extends UIResponder implements UIApplicationDelegate {
  static ObjCProtocols = [UIApplicationDelegate]

  applicationDidFinishLaunchingWithOptions(): boolean {
    StoreUpdate.checkForUpdate()
    return true
  }

  applicationWillEnterForeground(): void {
    StoreUpdate.checkForUpdate()
  }
}
