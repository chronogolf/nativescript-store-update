# Nativescript-store-update

[![npm](https://img.shields.io/npm/v/nativescript-store-update.svg)](https://www.npmjs.com/package/nativescript-store-update)
[![npm](https://img.shields.io/npm/dt/nativescript-store-update.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-store-update)

[![NPM](https://nodei.co/npm/nativescript-store-update.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nativescript-store-update/)

This plugin allows you to define a notification strategy regarding your app updates. You are able to specify if you want to force, offer or ignore an update based on the new version available in the platform store.

For example, you could want to force all major version update, but offer the option to your user to chose to update or skip a minor or patch version.

You can also specify how many days after the update release you want to display the alert.

## Prerequisites

You need to add appversion plugins for this one to work:
```zsh
tns plugin add nativescript-appversion
```

## Installation

```zsh
tns plugin add nativescript-store-update
```

## Usage

In your `main.ts` or `app.ts` file, before app start, call `StoreUpdate.init` with desired options like so:

``` javascript
    import { StoreUpdate, AlertTypesConstants } from "nativescript-store-update";

    StoreUpdate.init({
        notifyNbDaysAfterRelease: 1,
        majorUpdateAlertType: AlertTypesConstants.OPTION
    })
```

## Localization

The plugin contains some default translations inside json files located in `src/i18n` folder and required by hand in the `src/helpers/locales.helper.ts` file.
You can also specify a custom translation in the plugin initialization through the configuraiton options.
If you want to contribute a regionalized translation, you must use the `lang-regionCode` format specified in [Apple doc](https://developer.apple.com/library/content/documentation/MacOSX/Conceptual/BPInternational/LanguageandLocaleIDs/LanguageandLocaleIDs.html), but with the country lowercased (ex: `fr-ca`, `en-us`)


## API

### Configuration options
| Property | Default | Description |
| --- | --- | --- |
| **majorUpdateAlertType** | FORCE | Alert type for major version change (e.g: A.b.c.d) |
| **minorUpdateAlertType** | OPTION | Alert type for minor version change (e.g: a.B.c.d) |
| **patchUpdateAlertType** | NONE | Alert type for major version change (e.g: a.b.C.d) |
| **revisionUpdateAlertType** | NONE | Alert type for revision version change (e.g: a.b.c.D) |
| **notifyNbDaysAfterRelease** | `1` | Delays the update prompt by a specific number of days |
| **countryCode** | `en` | country store code |
| **alertOptions** | null | Customize alert dialog text, bypasses the Locale json |

### Alert types
| Key | Value | Description |
| --- | --- | --- |
| **FORCE** | `1` | Show an alert that can't be skipped |
| **OPTION** | `2` | Show an alert that can be skipped |
| **NONE** | `3` | Don't display alert at all |

### AlertOptions configuration (Optional)
| Property | Default | Description |
| --- | --- | --- |
| **title** | LocaleText | Dialog title, fallback to the locale json |
| **message** | LocaleText | Dialog body text, fallback to the locale json |
| **updateButton** | LocaleText | Dialog update button, fallback to the locale json |
| **skipButton** | LocaleText | Dialog skip button, fallback to the locale json |

## Development

Clone this repository, go in the `src` folder then run the command `npm run setup`
You can then use:
- `npm run demo.ios` or `npm run demo.android` to start the demo
- `npm run plugin.tscwatch` to watch plugin file and start developing!

The repo contains 2 demos folder, one with angular, and one without.
Demos use the bundleId `com.bitstrips.imoji` as their App version contains Major, Minor and Patch numbers, and they update their app really often.
You can change parameters passed ton package init in `main.ts` or `app.ts` files and change app version in android `app.gradle` and ios `info.plist` config files to test the feature.

## License

Apache License Version 2.0, January 2004


## Contributors
- [Jérémy Pelé](https://github.com/jeremypele)
- [Simon Bats](https://github.com/SBats)
- [Steve McNiven-Scott](https://github.com/sitefinitysteve)
