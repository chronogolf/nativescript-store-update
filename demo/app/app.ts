/* tslint:disable */
import './bundle-config'
/* tslint:enable */

import { AlertTypesConstants, StoreUpdate } from 'nativescript-store-update'
import * as application from 'tns-core-modules/application'

StoreUpdate.init({
  majorUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 0,
  alertOptions: {
    title: 'Attention please',
    message: 'Your app is out of date',
  },
})

application.start({ moduleName: 'main-page' })
