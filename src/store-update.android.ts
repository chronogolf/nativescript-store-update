import { StoreUpdateCommon } from './store-update.common'
import { GooglePlayHelper } from './helpers/google-play.helper'
import { VersionHelper } from './helpers/version.helper'
import { getVersionCode, getVersionName } from 'nativescript-appversion'
import { alert } from 'tns-core-modules/ui/dialogs'

export class StoreUpdate extends StoreUpdateCommon {
  appInfo: { version: string, build: string} = {
    version: '',
    build  : ''
  }

  constructor() {
    super();
    this._initAppInfos()
    this.checkForUpdate();
  }

  get localVersionNumber(): string {
    return `${this.appInfo.version}.${this.appInfo.build}`;
  }

  checkForUpdate() {
    GooglePlayHelper.getAppInfos('com.bitstrips.imoji')
      .then(infos => {
        this._checkAppVersion({
          local: this.appInfo.version,
          store: infos.version
        })
      })
      .catch(console.error)
  }

  private _initAppInfos() {
    getVersionName().then(v => this.appInfo.version = v)
    getVersionCode().then(v => this.appInfo.build = v)
  }

  private _appWasUpdated(storeDate) {
    alert(`
      local: ${new Date().toISOString()}
      vs
      distant: ${storeDate}
    `)
  }

  private _checkAppVersion(versions) {
    if (VersionHelper.isMajorUpdate(versions.store, versions.local)) {
      return this._showMajorUpdateAlert(versions)
    }

    if (VersionHelper.isMinorUpdate(versions.store, versions.local)) {
      return this._showMinorUpdateAlert(versions)
    }

    if (VersionHelper.isPatchUpdate(versions.store, versions.local)) {
      return this._showPatchUpdateAlert(versions)
    }
  }

  private _showMajorUpdateAlert(versions) {
    alert(`
    local: ${versions.local}
    vs
    store: ${versions.store}
    This is a major version update !
  `)
  }

  private _showMinorUpdateAlert(versions) {
    alert(`
    local: ${versions.local}
    vs
    store: ${versions.store}
    This is a minor version update !
  `)
  }

  private _showPatchUpdateAlert(versions) {
    alert(`
    local: ${versions.local}
    vs
    store: ${versions.store}
    This is a patch version update !
  `)
  }
}
