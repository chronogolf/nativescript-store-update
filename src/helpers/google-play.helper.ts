import { GooglePlayConstants } from '../constants/google-play'

export class GooglePlayHelper {
  public static getAppInfos() {
    return GooglePlayHelper._getAppPage()
      .then(GooglePlayHelper._convertHTMLToText)
      .then(GooglePlayHelper._parseResource)
  }

  private static _getAppPage() {
    return fetch(`${GooglePlayConstants.PLAY_STORE_ROOT_WEB}com.shots.android`)
  }


  private static _parseResource(page) {
    const version = GooglePlayConstants.VERSION_REGEX.exec(page)[1]
    const date = GooglePlayConstants.DATE_REGEX.exec(page)[1]
    return { version, date }
  }

  private static _convertHTMLToText(resource) {
    return resource.text()
  }
}
