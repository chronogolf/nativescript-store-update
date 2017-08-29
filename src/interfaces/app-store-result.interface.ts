export interface IAppleStoreResult {
  bundleId: string;
  trackId: number;
  version: string;
  minimumOsVersion: string;
  currentVersionReleaseDate: string;
}

/**
 N.B - results:
   Used to contain all versions, but now only contains the latest version.
   Still returns an instance of Array.
 */
export interface IAppleStoreInfos {
  resultCount: number;
  results: IAppleStoreResult[];
}
