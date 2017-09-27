const moment = require('moment')
const platform = require('tns-core-modules/platform')
const StoreUpdateModule = require('nativescript-store-update')
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const LocalesHelper = StoreUpdateModule.LocalesHelper

const environment = {
  appId: 'com.bitstrips.imoji',
  appVersion: '1.1.1.1',
  buildVersion: '123',
  countryCode: 'ca',
  osVersion: platform.device.osVersion,
}

const dates = {
  today: moment(),
  threeDaysAgo: moment().subtract(3, 'days'),
}

// Alerts
const defaultOptions = {
  message: LocalesHelper.translate('ALERT_MESSAGE'),
  neutralButtonText: null,
  okButtonText: LocalesHelper.translate('ALERT_UPDATE_BUTTON'),
  title: LocalesHelper.translate('ALERT_TITLE'),
}
const skippableOptions = Object.assign({}, defaultOptions, {
  neutralButtonText: LocalesHelper.translate('ALERT_SKIP_BUTTON'),
})
const alerts = { defaultOptions, skippableOptions }

const android = {
  urlWithCountryCode: `https://play.google.com/store/apps/details?id=${environment.appId}&hl=${environment.countryCode}`,
  urlWithoutCountryCode: `https://play.google.com/store/apps/details?id=${environment.appId}`,
  storeURL: `market://details?id=${environment.appId}`,
  storePage: `
  <div>
    <div><div itemprop="datePublished">${dates.threeDaysAgo.format('D MMM YYYY')}</div></div>
    <div><div itemprop="operatingSystems">${environment.osVersion} and beyond</div></div>
    <div><div itemprop="softwareVersion">${environment.buildVersion}</div></div>
  </div>
  `,
  storeParsedPage: {
    date: dates.threeDaysAgo.format('D MMM YYYY'),
    os: environment.osVersion,
    version: environment.buildVersion,
  },
}

const config = {
  majorUpdateAlertType: AlertTypesConstants.FORCE,
  minorUpdateAlertType: AlertTypesConstants.OPTION,
  patchUpdateAlertType: AlertTypesConstants.NONE,
  revisionUpdateAlertType: AlertTypesConstants.OPTION,
  notifyNbDaysAfterRelease: 2,
  countryCode: environment.countryCode,
}

const HTTPResponse = {
  success: { status: 200 },
  error: { status: 404 },
}

const ios = {
  urlWithCountryCode: `https://itunes.apple.com/lookup?bundleId=${environment.appId}&hl=${environment.countryCode}`,
  urlWithoutCountryCode: `https://itunes.apple.com/lookup?bundleId=${environment.appId}`,
  storeURL: `itms-apps://itunes.com/app/${environment.appId}`,
  validResource: {
    resultCount: 3,
    results: [1, 2, 3],
  },
  nonValidResource: {
    resultCount: 0,
  },
}

const translation = {
  key: 'ALERT_TITLE',
  value: 'Update available',
}

const updates = {
  major: '2.1.1.1',
  minor: '1.2.1.1',
  patch: '1.1.2.1',
  revision: '1.1.1.2',
  past: '0.0.0.1',
}

const os = {
  lower: '0.1',
  higher: '100.2',
}

module.exports = {
  alerts,
  android,
  config,
  dates,
  environment,
  HTTPResponse,
  ios,
  os,
  translation,
  updates,
}
