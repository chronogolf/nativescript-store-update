/* tslint:disable */
import './bundle-config'
/* tslint:enable */

import { AlertTypesConstants, StoreUpdate } from 'nativescript-store-update'
import * as application from 'tns-core-modules/application'


StoreUpdate.init({
  majorUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 1,
})

/*
//Custom message testing
StoreUpdate.init({
  majorUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 1,
  alertOptions: {
    custom: true,
    title: "Attention",
    //message: "Your app is busted out of date",
    //updateButton: "Update now",
    skipButton: "Skip" //Ignoring, testing fallback to Localehelper
  }
})
*/
application.start({ moduleName: 'main-page' })
