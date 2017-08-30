import './bundle-config'

import { AlertTypesConstants, StoreUpdate } from 'nativescript-store-update'
import * as application from 'tns-core-modules/application'

StoreUpdate.init({
  majorUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 1,
})
application.start({ moduleName: 'main-page' })
