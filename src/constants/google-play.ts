export const GooglePlayConstants = {
  PLAY_STORE_ROOT_WEB: `https://play.google.com/store/apps/details`,
  PLAY_STORE_PACKAGE_NOT_PUBLISHED_IDENTIFIER: `
    We're sorry, the requested URL was not found on this server.
  `,
  REGEX: {
    VERSION: /itemprop="softwareVersion">\s*([0-9.]*)\s*<\/div>\s*<\/div>/gm,
    DATE   : /itemprop="datePublished">\s*([\w\s,.]*)\s*<\/div>\s*<\/div>/gm,
    OS     : /itemprop="operatingSystems">\s*([0-9.]*)[\w\s,]*<\/div>\s*<\/div>/gm,
  },
}
