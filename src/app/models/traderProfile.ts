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
  soMeShare: boolean;
  confirmedLocation?: number[];
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
  currentDistance?: number;
}

export enum TraderProfileStatus {
  CREATED = 'CREATED',
  VERIFIED = 'VERFIED',
  PUBLIC = 'PUBLIC',
  DELETED = 'DELETED',
}
