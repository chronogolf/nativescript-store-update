import { AlertTypesConstants } from "./";

export const StoreUpdateConstants = {
  LAST_VERSION_SKIPPED_KEY: "lastVersionSkipped",
  DEFAULT_CONFIG: {
    majorUpdateAlertType    : AlertTypesConstants.FORCE,
    minorUpdateAlertType    : AlertTypesConstants.OPTION,
    patchUpdateAlertType    : AlertTypesConstants.NONE,
    revisionUpdateAlertType : AlertTypesConstants.NONE,
    notifyNbDaysAfterRelease: 1,
  }
}
