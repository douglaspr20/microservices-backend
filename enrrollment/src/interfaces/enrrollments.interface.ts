export interface IEnrollment {
  Classes: any[];
  Clients: null;
  Course: null;
  SemesterId: null;
  IsAvailable: boolean;
  Id: number;
  ClassDescription: ClassDescription;
  DaySunday: boolean;
  DayMonday: boolean;
  DayTuesday: boolean;
  DayWednesday: boolean;
  DayThursday: boolean;
  DayFriday: boolean;
  DaySaturday: boolean;
  AllowOpenEnrollment: boolean;
  AllowDateForwardEnrollment: boolean;
  StartTime: string;
  EndTime: string;
  StartDate: string;
  EndDate: string;
  Staff: Staff;
  Location: Location;
}

export interface ClassDescription {
  Active: boolean;
  Description: string;
  Id: number;
  ImageURL: string;
  LastUpdated: string;
  Level: Level;
  Name: string;
  Notes: string;
  Prereq: string;
  Program: Program;
  SessionType: SessionType;
  Category: null;
  CategoryId: null;
  Subcategory: null;
  SubcategoryId: null;
}

export interface Level {
  Id: number;
  Name: string;
  Description: null;
}

export interface Program {
  Id: number;
  Name: string;
  ScheduleType: string;
  CancelOffset: number;
  ContentFormats: string[];
}

export interface SessionType {
  Type: string;
  DefaultTimeLength: null;
  StaffTimeLength: null;
  Id: number;
  Name: string;
  NumDeducted: number;
  ProgramId: number;
}

export interface Location {
  AdditionalImageURLs: any[];
  Address: string;
  Address2: string;
  Amenities: null;
  BusinessDescription: string;
  City: string;
  Description: null;
  HasClasses: boolean;
  Id: number;
  Latitude: number;
  Longitude: number;
  Name: string;
  Phone: string;
  PhoneExtension: string;
  PostalCode: string;
  SiteID: null;
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

export interface Staff {
  Address: string;
  AppointmentInstructor: boolean;
  AlwaysAllowDoubleBooking: boolean;
  Bio: string;
  City: string;
  Country: string;
  Email: null;
  FirstName: string;
  HomePhone: string;
  Id: number;
  IndependentContractor: boolean;
  IsMale: boolean;
  LastName: string;
  MobilePhone: null;
  Name: null;
  PostalCode: string;
  ClassTeacher: boolean;
  SortOrder: number;
  State: string;
  WorkPhone: null;
  ImageUrl: null;
  ClassAssistant: boolean;
  ClassAssistant2: boolean;
  EmploymentStart: null;
  EmploymentEnd: null;
  ProviderIDs: null;
  Rep: boolean;
  Rep2: boolean;
  Rep3: boolean;
  Rep4: boolean;
  Rep5: boolean;
  Rep6: boolean;
  Appointments: any[];
  Unavailabilities: any[];
  Availabilities: any[];
  EmpID: null;
}
