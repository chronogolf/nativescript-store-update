# Nativescript-store-update

Add your plugin badges here. See [nativescript-urlhandler](https://github.com/hypery2k/nativescript-urlhandler) for example.

Then describe what's the purpose of your plugin.

In case you develop UI plugin, this is where you can add some screenshots.

## (Optional) Prerequisites / Requirements

Describe the prerequisites that the user need to have installed before using your plugin. See [nativescript-firebase plugin](https://github.com/eddyverbruggen/nativescript-plugin-firebase) for example.

## Installation

```zsh
tns plugin add nativescript-appversion
tns plugin add nativescript-i18n
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

Translations are handled via json files which are located in `src/i18n` folder and required by hand in the `src/helpers/locales.helper.ts` file. If you want to contribute a regionalized translation, you must use the `lang-regionCode` format specified in [Apple doc](https://developer.apple.com/library/content/documentation/MacOSX/Conceptual/BPInternational/LanguageandLocaleIDs/LanguageandLocaleIDs.html), but with the country lowercased (ex: `fr-ca`, `en-us`)


## API

### Configuration options
| Property | Default | Description |
| --- | --- | --- |
| **majorUpdateAlertType** | FORCE | Alert type for major version change |
| **minorUpdateAlertType** | OPTION | Alert type for minor version change |
| **majorUpdateAlertType** | NONE | Alert type for major version change |
| **revisionUpdateAlertType** | NONE | Alert type for revision version change |
| **notifyNbDaysAfterRelease** | `1` | Delays the update prompt by a specific number of days |
| **countryCode** | `en` | country store code |

### Alert types
| Key | Value | Description |
| --- | --- | --- |
| **FORCE** | `1` | Show an alert that can't be skipped |
| **OPTION** | `2` | Show an alert that can be skipped |
| **NONE** | `3` | Don't display alert at all |

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
