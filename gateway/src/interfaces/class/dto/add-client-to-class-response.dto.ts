export class AddClientToClassResponseDto {
  message: string;
  data: IVisit | null;

  errors?: { [key: string]: any };
}

export interface IVisit {
  AppointmentId: number;
  AppointmentGenderPreference: string;
  AppointmentStatus: string;
  ClassId: number;
  ClientId: string;
  StartDateTime: string;
  EndDateTime: string;
  Id: number;
  LastModifiedDateTime: string;
  LateCancelled: boolean;
  LocationId: null;
  MakeUp: boolean;
  Name: null;
  ServiceId: null;
  ServiceName: null;
  ProductId: null;
  SignedIn: boolean;
  StaffId: null;
  WebSignup: boolean;
  Action: string;
  CrossRegionalBookingPerformed: boolean;
  SiteId: null;
  WaitlistEntryId: null;
}
