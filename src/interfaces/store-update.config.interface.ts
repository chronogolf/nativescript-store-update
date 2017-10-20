export interface IStoreUpdateConfig {
  majorUpdateAlertType?: number
  minorUpdateAlertType?: number
  patchUpdateAlertType?: number
  revisionUpdateAlertType?: number
  notifyNbDaysAfterRelease?: number
  countryCode?: string
  onConfirmed?: any
  alertOptions?: AlertOptions
}

export interface AlertOptions {
  custom? :boolean,
  title?: string,
  message?: string,
  updateButton?: string,
  skipButton?: string
}