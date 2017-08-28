import { AlertTypesConstant } from "./";

export const StoreUpdateConstants = {
  LAST_VERSION_SKIPPED_KEY: "lastVersionSkipped",
  DEFAULT_CONFIG: {
    majorUpdateAlertType    : AlertTypesConstant.FORCE,
    minorUpdateAlertType    : AlertTypesConstant.OPTION,
    patchUpdateAlertType    : AlertTypesConstant.NONE,
    revisionUpdateAlertType : AlertTypesConstant.NONE,
    notifyNbDaysAfterRelease: 1,
  }
}
