export interface IClient {
  SuspensionInfo: SuspensionInfo;
  AppointmentGenderPreference: string;
  BirthDate: string;
  Country: string;
  CreationDate: string;
  CustomClientFields: any[];
  ClientCreditCard: ClientCreditCard | null;
  ClientIndexes: any[];
  ClientRelationships: null;
  FirstAppointmentDate: string;
  FirstName: string;
  Id: string;
  IsCompany: boolean;
  IsProspect: boolean;
  LastName: string;
  Liability: ClientLiability;
  LiabilityRelease: boolean;
  MembershipIcon: number;
  MobileProvider: null;
  Notes: null;
  State: string;
  UniqueId: number;
  LastModifiedDateTime: string;
  RedAlert: null;
  YellowAlert: null;
  MiddleName: null;
  ProspectStage: null;
  Email: string;
  MobilePhone: null;
  HomePhone: null;
  WorkPhone: string;
  AccountBalance: number;
  AddressLine1: null;
  AddressLine2: null;
  City: null;
  PostalCode: null;
  WorkExtension: null;
  ReferredBy: null;
  PhotoUrl: null;
  EmergencyContactInfoName: null;
  EmergencyContactInfoEmail: null;
  EmergencyContactInfoPhone: null;
  EmergencyContactInfoRelationship: null;
  Gender: null;
  LastFormulaNotes: null;
  Active: boolean;
  SalesReps: null | string[];
  Status: null;
  Action: string;
  SendAccountEmails: boolean;
  SendAccountTexts: boolean;
  SendPromotionalEmails: boolean;
  SendPromotionalTexts: boolean;
  SendScheduleEmails: boolean;
  SendScheduleTexts: boolean;
  HomeLocation: ClientHomeLocation | null;
  LockerNumber: null;
}

export interface SuspensionInfo {
  BookingSuspended: boolean;
  SuspensionStartDate: string | null;
  SuspensionEndDate: string | null;
}

export interface ClientCreditCard {
  Address?: string | null;
  CardHolder: string;
  CardType: string;
  CardNumber: string;
  City?: string | null;
  ExpMonth: string;
  ExpYear: string;
  LastFour?: string;
  PostalCode?: string;
  State?: string | null;
}

export interface ClientLiability {
  AgreementDate: null;
  IsReleased: boolean;
  ReleasedBy: null;
}

export interface ClientHomeLocation {
  AdditionalImageURLs: string[];
  Address: string;
  Address2: string;
  Amenities: null;
  BusinessDescription: string | null;
  City: string;
  Description: string | null;
  HasClasses: boolean;
  Id: number;
  Latitude: number;
  Longitude: number;
  Name: string;
  Phone: string;
  PhoneExtension: string;
  PostalCode: string;
  SiteID: number | null;
  StateProvCode: string;
  Tax1: number;
  Tax2: number;
  Tax3: number;
  Tax4: number;
  Tax5: number;
  TotalNumberOfRatings: number;
  AverageRating: number;
  TotalNumberOfDeals: number;
}
