import { GooglePlayConstants } from '../constants/google-play'

export class GooglePlayHelper {
  public static getAppInfos(bundleID) {
    return GooglePlayHelper._getAppPage(bundleID)
      .then(GooglePlayHelper._handleNotFound)
      .then(GooglePlayHelper._convertHTMLToText)
      .then(GooglePlayHelper._parseResource)
  }

  private static _getAppPage(bundleID) {
    return fetch(`${GooglePlayConstants.PLAY_STORE_ROOT_WEB}${bundleID}`)
  }


  private static _parseResource(page) {
    const version = GooglePlayConstants.VERSION_REGEX.exec(page)[1]
    const date = GooglePlayConstants.DATE_REGEX.exec(page)[1]
    return { version, date }
  }

  private static _handleNotFound(response) {
    if (response.status === 404) {
      throw new Error(GooglePlayConstants.PLAY_STORE_PACKAGE_NOT_PUBLISHED_IDENTIFIER)
    }
    return response
  }

  private static _convertHTMLToText(response) {
    return response.text()
  }
}
