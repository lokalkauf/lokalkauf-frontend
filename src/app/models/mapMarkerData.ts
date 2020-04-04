export interface MapMarkerData {
  html: string;
  additionalData: any;
  locationLongitude: number;
  locationLatitude: number;
  activatedStatus?: ActivatedStatus;
}

export enum ActivatedStatus {
  DEACTIVATED,
  DEFAULT,
  ACTIVATED,
}
