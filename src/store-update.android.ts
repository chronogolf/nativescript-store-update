import { getVersionName } from 'nativescript-appversion'
import { alert } from 'tns-core-modules/ui/dialogs'

import { StoreUpdateCommon } from './store-update.common'
import { GooglePlayHelper, VersionHelper } from './helpers'
import { IStoreUpdateConfig } from './interfaces'

export class StoreUpdate extends StoreUpdateCommon {
  private _localVersion: string = ''

  constructor(config: IStoreUpdateConfig) {
    super(config);
    this._initAppInfos()
    this.checkForUpdate();
  }

  get localVersionNumber(): string {
    return this._localVersion;
  }

  checkForUpdate() {
    GooglePlayHelper.getAppInfos('com.bitstrips.imoji')
      .then(infos => {
        this._checkAppVersion({
          local: this._localVersion,
          store: infos.version
        })
      })
      .catch(console.error)
  }

  private _initAppInfos() {
    getVersionName().then(v => this._localVersion = v)
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
