export interface TraderProfile {
  businessname: string;
  ownerFirstname: string;
  ownerLastname: string;
  postcode: string;
  city: string;
  street: string;
  number: number;
  description: string;
  pickup: boolean;
  delivery: boolean;
  email: string;
  telephone: string;
  thumbnailUrl?: string;
  status: TraderProfileStatus;
}

export enum TraderProfileStatus {
  CREATED = 'CREATED',
  VERIFIED = 'VERFIED',
  PUBLIC = 'PUBLIC',
  DELETED = 'DELETED'
}
