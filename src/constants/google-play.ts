export const GooglePlayConstants = {
  PLAY_STORE_ROOT_WEB: `https://play.google.com/store/apps/details?hl=en&id=`,
  PLAY_STORE_PACKAGE_NOT_PUBLISHED_IDENTIFIER: `
    We're sorry, the requested URL was not found on this server.
  `,
  VERSION_REGEX: /itemprop="softwareVersion">\s*([0-9.]*)\s*<\/div>\s*<\/div>/gm,
  DATE_REGEX: /itemprop="datePublished">\s*([\w\s,]*)\s*<\/div>\s*<\/div>/gm,
}
