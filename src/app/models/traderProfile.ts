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
  defaultImagePath?: string;
  storeEmail: string;
  homepage: string;
  status: TraderProfileStatus;
  storeType: {
    gastronomie: boolean;
    lebensmittel: boolean;
    fashion: boolean;
    buchhandlung: boolean;
    homedecor: boolean;
    blumengarten: boolean;
    handwerk: boolean;
    sonstiges: boolean;
  };
}

export enum TraderProfileStatus {
  CREATED = 'CREATED',
  VERIFIED = 'VERFIED',
  PUBLIC = 'PUBLIC',
  DELETED = 'DELETED',
}
