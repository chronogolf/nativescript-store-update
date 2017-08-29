if ((global as any).TNS_WEBPACK) {
  require('tns-core-modules/bundle-entry-points')

  global.registerModule('main-page', () => require('./main-page'))
}
