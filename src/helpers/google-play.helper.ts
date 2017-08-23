import { GooglePlayConstants } from '../constants/google-play'

export class GooglePlayHelper {
  public static getAppInfos(bundleID) {
    return GooglePlayHelper._getAppPage(bundleID)
      .then(GooglePlayHelper._handleError)
      .then(GooglePlayHelper._convertHTMLToText)
      .then(GooglePlayHelper._parseResource)
  }

  private static _getAppPage(bundleID) {
    return fetch(`${GooglePlayConstants.PLAY_STORE_ROOT_WEB}${bundleID}`)
  }


  private static _parseResource(page) {
    const infos: any = {}
    Object.keys(GooglePlayConstants.REGEX)
      .map(key => {
        infos[key.toLowerCase()] = GooglePlayConstants.REGEX[key].exec(page)[1] || null
      })
    return infos
  }

  private static _handleError(response) {
    if (response.status >= 400) {
      throw new Error(GooglePlayConstants.PLAY_STORE_PACKAGE_NOT_PUBLISHED_IDENTIFIER)
    }
    return response
  }

  private static _convertHTMLToText(response) {
    return response.text()
  }
}
