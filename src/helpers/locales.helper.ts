export class LocalesHelper {
  static currentLang = 'en'

  private static _defaultLang = 'en'
  private static _translations: { [langKey: string]: any; } = {
    en: require('../i18n/en.json'),
    fr: require('../i18n/fr.json'),
    es: require('../i18n/es.json')
  }

  static translate(key: string): string {
    const translation = LocalesHelper._translations[LocalesHelper.currentLang][key]
    if (!translation) {
      console.error(`Can't find translation for ${key} in ${LocalesHelper.currentLang}`)
      return ''
    }
    return translation
  }

  static changeLang(key: string): void {
    key = key.toLowerCase()
    const langKey = LocalesHelper._translations[key] ? key : key.split('-')[0]
    if (!LocalesHelper._translations[langKey]) {
      LocalesHelper.currentLang = LocalesHelper._defaultLang
      console.error(`
        The lang ${langKey} is not yet supporter by the plugin,
        but you can contribute it on https://github.com/chronogolf/nativescript-store-update
      `)
      return
    }
    LocalesHelper.currentLang = langKey
  }
}
